import mime from 'mime-types';
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import mysql from 'mysql2';
import fs from 'fs-extra';
import path from 'path';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import DOMPurify from 'isomorphic-dompurify';

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
app.use(cors(corsOptions));
app.use(helmet()); // Security headers
app.use(mongoSanitize()); // Prevent NoSQL injection and XSS
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

// Rate limiting middleware
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: 'Zbyt wiele prób logowania. Spróbuj ponownie za 15 minut.',
  standardHeaders: true,
  legacyHeaders: false,
});

const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // 100 requests per window
  message: 'Zbyt wiele żądań. Spróbuj ponownie za minutę.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.user?.id, // More lenient for authenticated users
});

const uploadLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // 10 uploads per minute
  message: 'Zbyt wiele uploadów. Spróbuj ponownie za minutę.',
  standardHeaders: true,
  legacyHeaders: false,
});

const db = mysql.createConnection({
  host: 'localhost',
  user: 'admin',
  password: 'Wojtek2008',
  database: 'hoserv'
});

// Input validation helper
const validateInput = (input, maxLength = 255) => {
  if (typeof input !== 'string') return null;
  const sanitized = input.trim().substring(0, maxLength);
  // Remove null bytes and control characters
  return sanitized.replace(/[\x00-\x1F\x7F]/g, '');
};

// Validate folder/table names (prevent SQL injection)
const validateTableName = (name) => {
  if (!/^[a-zA-Z0-9_]+$/.test(name)) return null;
  return name;
};


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

    const userFolderPath = path.join(BASE_DIR, userId, folderName);
    console.log("Creating folder path: " + userFolderPath);
    await fs.ensureDir(userFolderPath);
    cb(null, userFolderPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// ======== API Endpoints ========

// POST: Login
app.post('/api/login', loginLimiter, async (req, res) => {
  try {
    const login = validateInput(req.body.login, 50);
    const password = validateInput(req.body.password, 100);

    if (!login || !password) {
      return res.status(400).json({ success: false, message: 'Nieprawidłowe dane wejściowe' });
    }

    const query = `SELECT id, login FROM users WHERE login = ? AND password = ?`;
    const [results] = await db.promise().query(query, [login, password]);

    if (results.length > 0) {
      const user = results[0];
      const token = jwt.sign({ id: user.id, login: user.login }, JWT_SECRET, { expiresIn: '1h' });

      res.cookie('token', token, {
        httpOnly: true,
        sameSite: 'strict',
        secure: false,
        path: '/',
        maxAge: 60 * 60 * 1000
      });

      res.status(200).json({ success: true });
    } else res.status(401).json({ success: false, message: 'Nieprawidłowe dane logowania' });

  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ error: 'Błąd serwera' });
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
app.post('/api/photos', apiLimiter, verifyToken, async (req, res) => {
  const folder = validateInput(req.body.folder, 100);
  const dbName = validateTableName(req.body.db) || "photos_general";
  try{
    // if folder provided, filter by it
    if(folder){
      const [dbRows] = await db.promise().query(
          `SELECT * FROM \`${dbName}\` WHERE folder = ? LIMIT 10000`,
          [folder]
      );
      res.status(200).json(dbRows);
      return;
    }
    
    // else return all photos
    const [dbRows] = await db.promise().query(
        `SELECT * FROM \`${dbName}\` LIMIT 10000`,
    );
    res.status(200).json(dbRows);

  } catch (err) {
    console.error("SQL error:", err.message);
    res.status(500).json({ error: 'Błąd przy pobieraniu zdjęć' });
  }
});

// POST: Search for photos
app.post('/api/search', apiLimiter, verifyToken, async (req, res) => {
  const folder = validateInput(req.body.folder, 100);
  const dbName = validateTableName(req.body.db) || "photos_general";
  const search = validateInput(req.body.search, 100);
  const searchLike = '%' + search + '%';
  try{
    // if folder provided, filter by it
    if(folder){
      const [dbRows] = await db.promise().query(
          `SELECT * FROM \`${dbName}\` WHERE folder = ? and name LIKE ? LIMIT 1000`,
          [folder, searchLike]
      );
      res.status(200).json(dbRows);
      return;
    }
    
    // else return all photos
    const [dbRows] = await db.promise().query(
        `SELECT * FROM \`${dbName}\` WHERE name LIKE ? LIMIT 1000`,
        [searchLike]
    );
    res.status(200).json(dbRows);

  } catch (err) {
    console.error("SQL error:", err.message);
    res.status(500).json({ error: 'Błąd przy wyszukiwaniu' });
  }
});

// POST: Log out
app.post('/api/logout', verifyToken, (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ success: true });
});

// POST: Upload photo
app.post('/api/addPhoto', uploadLimiter, verifyToken, upload.array('files'), async (req, res) => {
    if (!req.body.folder || !req.body.access || !req.files || req.files.length === 0) {
        return res.status(400).json({ success: false, message: 'Proszę podać folder, dostęp lub zdjęcie/wideo.' });
    }

    try {
        const folder = validateInput(req.body.folder, 100);
        const userId = parseInt(req.body.access, 10);
        
        if (!folder || isNaN(userId) || userId < 1) {
          return res.status(400).json({ success: false, message: 'Nieprawidłowe dane' });
        }

        const files = req.files;
        
        // 2. Get the target database name
        const [dbRows] = await db.promise().query(
            'SELECT name FROM `db_photos` WHERE id = ?',
            [userId]
        );
        
        if (!dbRows.length) {
          return res.status(400).json({ success: false, message: 'Nieprawidłowy dostęp' });
        }
        
        const dbName = validateTableName(dbRows[0].name);
        if (!dbName) {
          return res.status(400).json({ success: false, message: 'Błąd w konfiguracji bazy' });
        }
        
        // Prepare the common INSERT query structure
        const query = `INSERT INTO \`${dbName}\` (\`name\`, \`date\`, \`user_id\`, \`folder\`, \`size\`, \`type\`) VALUES (?, ?, ?, ?, ?, ?)`;
        
        const insertionPromises = files.map(file => {
            const name = validateInput(file.filename, 255) || file.filename;
            const size = parseInt(file.size, 10) || 0;
            const type = validateInput(file.mimetype, 100) || 'unknown';
            const dateObj = req.body.lastModified ? new Date(req.body.lastModified) : new Date();
            const dateStr = dateObj.toISOString().slice(0, 19).replace('T', ' ');

            // 3. Execute query for each file
            return db.promise().query(query, [name, dateStr, userId, folder, size, type]);
        });
        
        // Wait for all database inserts to complete
        await Promise.all(insertionPromises);

        res.status(200).json({ success: true, count: files.length, message: `Dodano ${files.length} plików.` });

    } catch (err) {
        console.error("Upload error:", err.message);
        res.status(500).json({ error: 'Błąd przy uploadzei pliku' });
    }
});

// POST: Add a folder todo
app.post('/api/addFolder', apiLimiter, verifyToken, async (req, res) => {
  try{
    const folder = validateInput(req.body.folder, 100);
    const id = parseInt(req.body.id, 10);

    if (!folder || isNaN(id) || id < 1) {
      return res.status(400).json({ error: "Nieprawidłowe dane" });
    }

    const queryCheck = `SELECT * FROM db_folders WHERE name = ? AND userId = ?`
    const query = `INSERT INTO db_folders (\`name\`, \`userId\`) VALUES (?, ?)`;
    
    const [resultsCheck] = await db.promise().query( queryCheck, [folder, id] );
    if(resultsCheck.length != 0){
      res.status(400).json({ error: "Folder o tej nazwie już istnieje!"});
      return;
    }
    const [results] = await db.promise().query( query, [folder, id] );
    res.status(200).json({ success: true });

    } catch (err) {
        console.error("Folder error:", err.message);
        res.status(500).json({ error: 'Błąd przy tworzeniu folderu' });
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

    // Calculate user usage
    const [[userUsageRows]] = await db.promise().query(
      `SELECT SUM(size) AS totalSize FROM \`${userDb.name}\``
    );
    const userUsage = Number(userUsageRows.totalSize) || 0;
    
    // Calculate total usage
    const [allTableRows] = await db.promise().query('SELECT name FROM db_photos');
    const results = await Promise.all(
      allTableRows.map(row =>
        db.promise().query(`SELECT SUM(size) AS totalSize FROM \`${row.name}\``)
      )
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


app.post('/api/getDbTables', apiLimiter, verifyToken, async (req, res) => {
  try{
    const dbName = validateTableName(req.body.dbName);
    
    if (!dbName) {
      return res.status(400).json({ error: 'Nieprawidłowa nazwa bazy' });
    }
    
    const sql = `SELECT DISTINCT folder FROM \`${dbName}\` LIMIT 1000`;
    const [tableNames] = await db.promise().query(sql);

    res.status(200).json({
      success: true, 
      tableNames: tableNames
    });

  } catch (err) {
    console.error("DB tables error:", err.message);
    res.status(500).json({ error: 'Błąd przy pobieraniu tabel' });
  }
});

app.post('/api/getFolders', apiLimiter, verifyToken, async (req, res) => { 
  try {
    const access = parseInt(req.body.access, 10);

    if (isNaN(access) || access < 1) {
      return res.status(400).json({ error: 'Nieprawidłowy dostęp' });
    }

    const query = `SELECT id, name FROM db_folders WHERE userId = ?`;
    const [result] = await db.promise().query(query, [access]);
    res.status(200).json({
      result: result
    });

  } catch (err) {
    console.error("Folders error:", err.message);
    res.status(500).json({ error: 'Błąd przy pobieraniu folderów' });
  }
});
// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`HTTP Server running on port ${PORT}`);
});