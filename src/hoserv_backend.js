import express from 'express';
import cors from 'cors';
import multer from 'multer';
import mysql from 'mysql2';
import fs from 'fs-extra';
import path from 'path';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';


const app = express();
const PORT = 3000;
const DISK_SIZE = 900000000;
//const BASE_DIR = '/mnt/photos';
const BASE_DIR = '/home/oncatt1/Desktop/photos/';
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
app.use('/photos', cors(corsOptions), express.static(BASE_DIR));
app.use('/api', (req, res, next) => {
  const origin = req.headers.origin;
  if (!origin || originAllowed(origin)) return next();
  return res.status(403).json({ error: 'CORS origin not allowed' });
});

app.use(express.json());
app.use(cookieParser());

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
//   database: 'dupa'
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

// ======== NOT USER DEPENDENT APIs ========

// POST: Login
app.post('/api/login', (req, res) => {
  console.log("Starting login");
  const { login, password } = req.body;
  const query = `SELECT id, login FROM users WHERE login = ? AND password = ?`;

  db.query(query, [login, password], (err, results) => {
    if (err) return res.status(500).json({ error: err });

    if (results.length > 0) {
      const user = results[0];
      const token = jwt.sign({ id: user.id, login: user.login }, JWT_SECRET, { expiresIn: '1h' });

      res.cookie('token', token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
        path: '/',
        maxAge: 60 * 60 * 1000 // 1000minutes
      });

      res.status(200).json({ success: true });
    } else {
      res.status(401).json({ success: false, message: 'Nieprawidłowe dane logowania' });
    }
  });
});

// ======== USER DEPENDENT APIs ========

// GET: Return if logged in
app.get('/api/isLogged', (req, res) => {
  if (!req.cookies.token) {
    res.status(200).json({isLogged: false})
  }
  else{
    res.status(200).json({isLogged: true})
  }
})

// GET: About logged user
app.get('/api/me', verifyToken, (req, res) => {
  res.json({ user: req.user});
});

// GET: All photos
app.get('/api/photos', verifyToken, (req, res) => {
  db.query('SELECT * FROM photos_general', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// POST: Log out
app.post('/api/logout', verifyToken,(req, res) => {
  res.clearCookie('token');
  res.status(200).json({ success: true });
});

// POST: Upload photo
app.post('/api/addPhoto', verifyToken, upload.single('file'), (req, res) => {
  try {
    const folder = req.body.folder;
    const userId = req.body.access;
    console.log(req);
    const file = req.file;
    const name = file ? file.filename : (req.body.name || '');
    const size = file ? file.size : (req.body.size || 0);

    const dateObj = req.body.lastModified ? new Date(req.body.lastModified) : new Date();
    const dateStr = dateObj.toISOString().slice(0, 19).replace('T', ' ');

    const query = "INSERT INTO `photos_general` (`name`, `date`, `user_id`, `folder`, `size`) VALUES ( ? , ? , ? , ? , ? )";
    db.query(query, [name, dateStr, userId, folder, size], (err, results) => {
      if (err) {
        console.log("Nie udane dodanie", err.sqlMessage);
        return res.status(500).json({ error: err.sqlMessage });
      }
      console.log("Udane dodanie");
      res.status(200).json({ success: true });
    });
  } catch (err) {
    console.log('Upload error', err);
    res.status(500).json({ error: 'Upload failed' });
  }
});

app.get('/api/getUsage', verifyToken, (req, res) => {
  const userLogin = req.user.login; // FIXED

  // 1. Get user's main DB ID
  db.query(
    'SELECT db_main FROM users WHERE login = ?',
    [userLogin],
    (err, userRows) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error' });
      }

      if (userRows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      const userDbId = userRows[0].db_main;

      // 2. Get table name
      db.query(
        'SELECT name FROM db_photos WHERE id = ?',
        [userDbId],
        (err, dbRows) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Server error' });
          }

          if (dbRows.length === 0) {
            return res.status(404).json({ error: 'PhotoDB not found' });
          }

          const tableName = dbRows[0].name;

          // 3. Get the user’s usage
          const userQuery = `SELECT SUM(size) AS totalSize FROM \`${tableName}\``;

          db.query(userQuery, (err, sizeRows) => {
            if (err) {
              console.error(err);
              return res.status(500).json({ error: 'Server error' });
            }

            const userUsage = Number(sizeRows[0].totalSize) || 0;

            // 4. Get list of all photo tables
            db.query("SELECT name FROM db_photos", (err, allTableRows) => {
              if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Server error' });
              }

              let remaining = allTableRows.length;
              let totalUsage = 0;

              if (remaining === 0) {
                var totalUsagePercent = Number(((totalUsage / DISK_SIZE) * 100).toFixed(4));
                var userUsagePercent = Number(((userUsage / DISK_SIZE) * 100).toFixed(4));
                return res.json({
                  success: true,
                  userUsage,
                  totalUsage,
                  totalUsagePercent,
                  userUsagePercent
                });
              }

              // 5. Loop through each table and sum usage
              allTableRows.forEach(row => {
                const table = row.name;
                const q = `SELECT SUM(size) AS totalSize FROM \`${table}\``;

                db.query(q, (err, resultRows) => {
                  if (!err && resultRows.length > 0) {
                    totalUsage += Number(resultRows[0].totalSize) || 0;
                  }

                  remaining--;

                  // When all queries complete → send result
                  if (remaining === 0) {
                    var totalUsagePercent = Number(((totalUsage / DISK_SIZE) * 100).toFixed(4));
                    var userUsagePercent = Number(((userUsage / DISK_SIZE) * 100).toFixed(4));
                    res.json({
                      success: true,
                      userUsage,
                      totalUsage,
                      totalUsagePercent,
                      userUsagePercent
                    });
                  }
                });
              });
            });
          });
        }
      );
    }
  );
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`HTTP Server running on port ${PORT}`);
});