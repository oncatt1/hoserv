import mime from 'mime-types';
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import mysql from 'mysql2';
import fs from 'fs-extra';
import path from 'path';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import helmet from 'helmet'; // [SEC] Added for HTTP Security Headers
import rateLimit from 'express-rate-limit'; // [SEC] Added for Rate Limiting

const app = express();
const PORT = 3000;
const DISK_SIZE = 900_000_000_000;
//const BASE_DIR = '/mnt/photos';
const BASE_DIR = '/home/oncatt1/Desktop/hoserv/photos'; // change
const JWT_SECRET = 'M0z4n0_rc0o2h@i3t';
const allowedOrigins = [
  'http://192.168.1.21:5173',
  'http://192.168.1.10',
  'http://localhost:5173',
  'http://192.168.1.10:5173',
  'http://192.168.1.10:5174'
];

const normalizedAllowed = allowedOrigins.map(o => o.replace(/\/+$/, '').toLowerCase());
function originAllowed(origin) {
  if (!origin) return false;
  return normalizedAllowed.includes(origin.toLowerCase());
}

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // pozwól w dev bez Origin
    return originAllowed(origin) ? callback(null, true) : callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
};

// [SEC] 1. Helmet: Sets various HTTP headers to prevent XSS, clickjacking, etc.
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }, // Allows your images to be loaded by the frontend
}));

app.use(cors(corsOptions));

// [SEC] 2. Rate Limiting: Prevents brute-force and spam
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: { error: 'Too many requests, please try again later.' }
});
// Apply rate limiting to all requests starting with /api
app.use('/api', apiLimiter);


app.use(
  '/photos',
  cors(corsOptions),
  express.static(BASE_DIR, {
    setHeaders: (res, filePath) => {
      const type = mime.lookup(filePath);
      if (type) {
        res.setHeader('Content-Type', type);
      }
      res.setHeader('Content-Disposition', 'inline');
      // [SEC] Prevent browsers from "sniffing" the mimetype (treats text as html)
      res.setHeader('X-Content-Type-Options', 'nosniff');
    }
  })
);

app.use('/api', (req, res, next) => {
  const origin = req.headers.origin;
  if (!origin || originAllowed(origin)) return next();
  return res.status(403).json({ error: 'CORS origin not allowed' });
});

app.use(express.json());
app.use(cookieParser());

// [SEC] 3. SQL Injection Helper
// Since you pass table names dynamically (which can't be parameterized like values),
// we must strictly validate them to ensure they contain NO special characters.
function isValidTableName(name) {
  // Only allows alphanumeric characters and underscores. No spaces, semicolons, dashes.
  return /^[a-zA-Z0-9_]+$/.test(name);
}

const db = mysql.createConnection({
  host: 'localhost',
  user: 'admin',
  password: 'Wojtek2008',
  database: 'hoserv'
});

// const db = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: '',
//   database: 'hoserv'
// });


// ======== Configs ========

// Middleware: JWT checks
function verifyToken(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    console.log("Nieudana weryfikacja tokenu " + token);
    return res.sendStatus(401);
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.sendStatus(403);
  }
}

// Multer config
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const userId = req.query.user;
    const folderName = req.query.folder;

    // [SEC] Path Traversal Prevention: Ensure folderName doesn't contain '..' or '/'
    const safeFolderName = path.basename(folderName);
    const safeUserId = path.basename(userId);

    const userFolderPath = path.join(BASE_DIR, safeUserId, safeFolderName);
    console.log("Creating folder path: " + userFolderPath);
    await fs.ensureDir(userFolderPath);
    cb(null, userFolderPath);
  },
  filename: (req, file, cb) => {
    // [SEC] Sanitize filename to prevent weird characters
    const safeName = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '');
    cb(null, Date.now() + '-' + safeName);
  }
});
const upload = multer({ storage });

// ======== API Endpoints ========

// POST: Login
app.post('/api/login', async (req, res) => {
  try {
    const { login, password } = req.body;
    // [SEC] This query is already safe (uses prepared statements ?)
    const query = `SELECT id, login FROM users WHERE login = ? AND password = ?`;
    const [results] = await db.promise().query(query, [login, password]);

    if (results.length > 0) {
      const user = results[0];
      const token = jwt.sign({ id: user.id, login: user.login }, JWT_SECRET, { expiresIn: '1h' });

      res.cookie('token', token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: false, // Set to true if using HTTPS
        path: '/',
        maxAge: 60 * 60 * 1000 // 1 hour
      });

      res.status(200).json({ success: true });
    } else res.status(401).json({ success: false, message: 'Nieprawidłowe dane logowania' });

  }catch (err) {
      res.status(500).json({ error: `Server error ${err}`});
  }

});

// GET: Return if logged in
app.get('/api/isLogged', (req, res) => {
  if (!req.cookies.token) res.status(200).json({isLogged: false})
  else res.status(200).json({isLogged: true})
})

// GET: About logged user
app.get('/api/me', verifyToken, (req, res) => {
  res.json({ user: req.user});
});

// GET: More about logged user
app.get('/api/user', verifyToken, async (req, res) => {
  const [result] = await db.promise().query(
    `SELECT login, db_main FROM users WHERE login = ?`, 
    req.user
  );

  res.status(200).json({
      user: result.login,
      dbId: result.db_main
    });
});

// POST: All photos
app.post('/api/photos', verifyToken, async (req, res) => {
  const folder = req.body.folder || "";
  const dbName = req.body.db || "photos_general";

  // [SEC] SQL Injection Fix: Validate table name before use
  if (!isValidTableName(dbName)) {
      return res.status(400).json({ error: "Invalid database name" });
  }

  try{
    // if folder provided, filter by it
    if(folder){
      const [dbRows] = await db.promise().query(
          `SELECT * FROM \`${dbName}\` WHERE folder = ?`,
          [folder]
      );
      res.status(200).json(dbRows);
      return;
    }
    
    // else return all photos
    const [dbRows] = await db.promise().query(
        `SELECT * FROM \`${dbName}\``, // Added backticks for safety
    );
    res.status(200).json(dbRows);

  } catch (err) {
    console.error("SQL INSERT ERROR:", err.sqlMessage ?? err.message);
    res.status(500).json({ error: `Upload failed: ${err.sqlMessage ?? err.message}` });
  }
});

// POST: Search for photos
app.post('/api/search', verifyToken, async (req, res) => {
  const folder = req.body.folder || "";
  const dbName = req.body.db || "photos_general";
  const search = req.body.search || "";
  const searchLike = '%' + search + '%';

  // [SEC] SQL Injection Fix: Validate table name
  if (!isValidTableName(dbName)) {
      return res.status(400).json({ error: "Invalid database name" });
  }

  try{
    // if folder provided, filter by it
    if(folder){
      const [dbRows] = await db.promise().query(
          `SELECT * FROM \`${dbName}\` WHERE folder = ? and name LIKE ?`,
          [folder, searchLike]
      );
      res.status(200).json(dbRows);
      return;
    }
    
    // else return all photos
    const [dbRows] = await db.promise().query(
        `SELECT * FROM \`${dbName}\` WHERE name LIKE ?`,
        [searchLike]
    );
    res.status(200).json(dbRows);

  } catch (err) {
    console.error("SQL INSERT ERROR:", err.sqlMessage ?? err.message);
    res.status(500).json({ error: `Upload failed: ${err.sqlMessage ?? err.message}` });
  }
});

// POST: Log out
app.post('/api/logout', verifyToken, (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ success: true });
});

// POST: Upload photo
app.post('/api/addPhoto', verifyToken, upload.array('files'), async (req, res) => {
    if (!req.body.folder || !req.body.access || !req.files || req.files.length === 0) {
        return res.status(400).json({ success: false, message: 'Proszę podać folder, dostęp lub zdjęcie/wideo.' });
    }

    try {
        const { folder, access } = req.body;
        // [SEC] Ensure userId is an Integer to prevent logic errors
        const userId = parseInt(access, 10);
        const files = req.files;
        
        // 2. Get the target database name
        const [dbRows] = await db.promise().query(
            'SELECT name FROM `db_photos`',
        );

        // [SEC] Check if userId points to a valid row
        if (!dbRows[userId - 1]) {
           return res.status(400).json({ error: "Invalid access ID" });
        }
        const dbName = dbRows[userId - 1].name;
        
        // [SEC] Validate retrieved dbName just in case
        if (!isValidTableName(dbName)) {
             throw new Error("Retrieved invalid DB name from database settings");
        }

        // Prepare the common INSERT query structure
        const query = `INSERT INTO \`${dbName}\` (\`name\`, \`date\`, \`user_id\`, \`folder\`, \`size\`, \`type\`) VALUES (?, ?, ?, ?, ?, ?)`;
        
        const insertionPromises = files.map(file => {
            const name = file.filename;
            const size = file.size;
            const type = file.mimetype;
            const dateObj = req.body.lastModified ? new Date(req.body.lastModified) : new Date();
            const dateStr = dateObj.toISOString().slice(0, 19).replace('T', ' ');

            // 3. Execute query for each file
            return db.promise().query(query, [name, dateStr, userId, folder, size, type]);
        });
        
        // Wait for all database inserts to complete
        await Promise.all(insertionPromises);

        res.status(200).json({ success: true, count: files.length, message: `Dodano ${files.length} plików.` });

    } catch (err) {
        console.error("SQL INSERT ERROR:", err.sqlMessage ?? err.message);
        res.status(500).json({ error: `Upload failed: ${err.sqlMessage ?? err.message}` });
    }
});

// POST: Add a folder todo
app.post('/api/addFolder', verifyToken, async (req, res) => {
  try{

    const folder = req.body.folder;
    const id = req.body.id;
    // [SEC] These queries are safe (Parameterized)
    const queryCheck = `SELECT * FROM db_folders WHERE name = ? AND userId = ?`
    const query = `INSERT INTO db_folders (\`name\`, \`userId\`) VALUES (?, ?)`;
    
    const [resultsCheck] = await db.promise().query( queryCheck, [folder, id] );
    if(resultsCheck.length != 0){
      res.status(500).json({ error: "Folder o tej nazwie już istnieje!"});
      return;
    }
    const [results] = await db.promise().query( query, [folder, id] );
    res.status(200).json({ success: true });

    } catch (err) {
        console.error("SQL INSERT ERROR:", err.sqlMessage ?? err.message);
        res.status(500).json({ error: `Upload failed: ${err.sqlMessage ?? err.message}` });
    }
})
// GET: Get usage info
app.get('/api/getUsage', verifyToken, async (req, res) => {
  try {
    const userLogin = req.user.login;

    // Get DB id for user
    const [userRows] = await db.promise().query(
        'SELECT db_main FROM users WHERE login = ?',
        [userLogin]
    );
    if (!userRows.length) return res.status(404).json({ error: 'User not found' });
    const userDbId = userRows[0].db_main;

    // Get user db name
    const [[userDb]] = await db.promise().query(
      'SELECT name FROM db_photos WHERE id = ?',
      [userDbId]
    );

    // [SEC] Validate table name from DB
    if(!isValidTableName(userDb.name)) throw new Error("Invalid DB structure");

    // Calculate user usage
    const [[userUsageRows]] = await db.promise().query(
      `SELECT SUM(size) AS totalSize FROM \`${userDb.name}\``
    );
    const userUsage = Number(userUsageRows.totalSize) || 0;
    
    // Calculate total usage
    const [allTableRows] = await db.promise().query('SELECT name FROM db_photos');
    const results = await Promise.all(
      allTableRows.map(row => {
          // [SEC] Validation loop
          if(!isValidTableName(row.name)) return Promise.resolve([[{totalSize:0}]]);
          return db.promise().query(`SELECT SUM(size) AS totalSize FROM \`${row.name}\``)
      })
    );

    const totalUsage = results.reduce((acc, [[r]]) => acc + Number(r.totalSize || 0), 0);
    var totalUsagePercent = Number(((totalUsage / DISK_SIZE) * 100).toFixed(4));
    var userUsagePercent = Number(((userUsage / DISK_SIZE) * 100).toFixed(4));
    res.status(200).json({
      success: true,
      userUsage,
      totalUsage,
      totalUsagePercent,
      userUsagePercent,
      DISK_SIZE
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: `Server error ${err}`});
  }
});

// GET: Get DB names
app.get('/api/getDBs', verifyToken, async (req, res) => {
  try {
    const userLogin = req.user.login;

    // Get DB id for user
    const [userRows] = await db.promise().query(
        'SELECT db_main FROM users WHERE login = ?',
        [userLogin]
    );
    if (!userRows.length) return res.status(404).json({ error: 'User not found' });
    const userDbId = userRows[0].db_main;

    // Get user db name
    const [[userDb]] = await db.promise().query(
      'SELECT id, name FROM db_photos WHERE id = ?',
      [userDbId]
    );

    res.status(200).json({
      success: true,
      name: userDb.name,
      id: userDb.id,
      general: "photos_general"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: `Server error ${err}`});
  }
});

// GET: Get photo count
app.get('/api/getPhotoCount', verifyToken, async (req, res) => {
    try {
        const userLogin = req.user.login;

        const [userRows] = await db.promise().query(
            'SELECT db_main FROM users WHERE login = ?',
            [userLogin]
        );
        if (!userRows.length) return res.status(404).json({ error: 'User not found' });
        const userDbId = userRows[0].db_main;

        const [[userDb]] = await db.promise().query(
          'SELECT name FROM db_photos WHERE id = ?',
          [userDbId]
        );

        if(!isValidTableName(userDb.name)) throw new Error("Invalid Table");

        // Count user photos
        const [[userPhotos]] = await db.promise().query(
            `SELECT COUNT(*) AS count FROM \`${userDb.name}\``
        );

        // Count general photos
        const [[generalPhotos]] = await db.promise().query(
            'SELECT COUNT(*) AS count FROM photos_general'
        );

        // Get all DB entries
        const [allTables] = await db.promise().query('SELECT name FROM db_photos');

        // Total size counting
        let totalUsage = 0;
        for (const row of allTables) {
            const table = row.name;
            if(!isValidTableName(table)) continue; // [SEC] Skip invalid tables

            const [[result]] = await db.promise().query(`SELECT COUNT(*) as count FROM \`${table}\``);

            totalUsage += result?.count ?? 0;
        }

        return res.json({
            success: true,
            userDbPhotoCount: userPhotos.count,
            generalDbPhotoCount: generalPhotos.count,
            totalUsage
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: `Server error ${err}`});
    }
});


app.post('/api/getDbTables', verifyToken, async (req, res) => { //rework
  try{
    const dbName = req.body.dbName;

    // [SEC] SQL Injection Fix: CRITICAL
    // User controls dbName, which is put directly into the query.
    if (!isValidTableName(dbName)) {
        return res.status(400).json({ error: "Invalid database name" });
    }
    
    const sql = `SELECT DISTINCT folder FROM \`${dbName}\``; 
    const [tableNames] = await db.promise().query(sql);

    res.status(200).json({
      success: true, 
      tableNames: tableNames
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: `Server error ${err}`});
  }
});

app.post('/api/getFolders', verifyToken, async (req, res) => { 
  try {
    const access = req.body.access;

    const query = `SELECT id, name FROM db_folders WHERE userId = ?`;
    const [result] = await db.promise().query(query, [access]); // [SEC] Fixed missing array brackets around params
    res.status(200).json({
      result: result
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: `Server error ${err}`});
  }
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`HTTP Server running on port ${PORT}`);
});