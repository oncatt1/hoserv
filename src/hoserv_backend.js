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
import bcrypt from 'bcrypt';
import crypto from 'crypto';


const app = express();
const PORT = 3000;
const DISK_SIZE = 900_000_000_000;
const BASE_DIR = '/home/oncatt1/Desktop/hoserv/photos';
const LOG_DIR = '/home/oncatt1/Desktop/hoserv/logs';

const JWT_SECRET = 'M0z4n0_rc0o2h@i3t'; 
const CSRF_SECRET = crypto.randomBytes(32).toString('hex'); 


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
  const allowed = normalizedAllowed.includes(origin.toLowerCase());
  // Log only if denied to reduce noise, or use debug level
  if (!allowed) logger.warn("Origin check failed", { origin });
  return allowed;
}

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || originAllowed(origin)) {
      return callback(null, true);
    }
    logger.warn("CORS Blocked Connection", { origin });
    return callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'X-Requested-With', 'Accept', 'X-CSRF-Token'],
  optionsSuccessStatus: 200
};

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
}));

app.use(cors(corsOptions));

// [LOG] HTTP Request Logging Middleware
app.use((req, res, next) => {
  logger.info(`Incoming Request: ${req.method} ${req.url}`, { ip: req.ip, userAgent: req.get('User-Agent') });
  next();
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn("Rate Limit Exceeded", { ip: req.ip });
    res.status(429).json({ error: 'Too many requests, please try again later.' });
  }
});
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
      res.setHeader('X-Content-Type-Options', 'nosniff');
    }
  })
);

app.use('/api', (req, res, next) => {
  const origin = req.headers.origin;
  if (!origin || originAllowed(origin)) return next();
  
  logger.warn("Manual API Origin Block", { origin });
  return res.status(403).json({ error: 'CORS origin not allowed' });
});

app.use(express.json());
app.use(cookieParser());

fs.ensureDirSync(LOG_DIR);
// ==========================================
// [LOG] Logger Utility
// ==========================================
const logger = {
  // Helper to get current timestamp
  getTime: () => new Date().toISOString().replace('T', ' ').substring(0, 19),

  // Helper to get today's filename (e.g., server-2024-02-20.log)
  getLogFileName: () => {
    const dateStr = new Date().toISOString().split('T')[0];
    return path.join(LOG_DIR, `server-${dateStr}.log`);
  },

  // Internal function to write to file and console
  write: (level, msg, meta = {}) => {
    const timestamp = logger.getTime();
    const metaStr = Object.keys(meta).length ? JSON.stringify(meta) : '';
    
    // 1. Format for Console (colored usually, but kept simple here)
    const consoleLine = `[${timestamp}] [${level}] ${msg} ${metaStr}`;
    
    // 2. Format for File (Clean text)
    const fileLine = `${consoleLine}\n`;

    // Write to Console
    if (level === 'ERROR') console.error(consoleLine);
    else if (level === 'WARN') console.warn(consoleLine);
    else console.log(consoleLine);

    // Write to File (Append mode)
    fs.appendFile(logger.getLogFileName(), fileLine, (err) => {
      if (err) console.error("CRITICAL: Failed to write to log file", err);
    });
  },
  
  info: (msg, meta) => logger.write('INFO', msg, meta),
  warn: (msg, meta) => logger.write('WARN', msg, meta),
  error: (msg, error) => {
    const errMeta = error instanceof Error ? { message: error.message, stack: error.stack } : error;
    logger.write('ERROR', msg, errMeta);
  }
};

logger.info("System initializing...", { PORT, BASE_DIR });
// ======== Security Helper Functions ========

function isValidTableName(name) {
  const isValid = /^[a-zA-Z0-9_]+$/.test(name);
  if (!isValid) logger.warn("Invalid table name detected", { name });
  return isValid;
}

function parseStrictInteger(value, fieldName = 'value') {
  if (typeof value !== 'number' && typeof value !== 'string') {
    logger.error(`Integer parsing failed: Invalid type for ${fieldName}`, { type: typeof value });
    throw new Error(`${fieldName} must be a number or numeric string`);
  }
  
  const str = String(value).trim();
  if (!/^-?\d+$/.test(str)) {
    logger.error(`Integer parsing failed: Invalid format for ${fieldName}`, { value: str });
    throw new Error(`${fieldName} must be a valid integer`);
  }
  
  const parsed = parseInt(str, 10);
  if (String(parsed) !== str) {
     logger.error(`Integer parsing failed: Precision loss for ${fieldName}`, { value: str });
    throw new Error(`${fieldName} contains invalid integer format`);
  }
  
  if (!Number.isSafeInteger(parsed)) {
    logger.error(`Integer parsing failed: Unsafe integer for ${fieldName}`, { value: parsed });
    throw new Error(`${fieldName} is outside safe integer range`);
  }
  
  return parsed;
}

function generateCsrfToken(sessionId) {
  const hmac = crypto.createHmac('sha256', CSRF_SECRET);
  hmac.update(sessionId);
  return hmac.digest('hex');
}

function validateCsrfToken(token, sessionId) {
  if (!token || !sessionId) {
    logger.warn("CSRF Validation missing token or session", { hasToken: !!token, hasSession: !!sessionId });
    return false;
  }
  const expectedToken = generateCsrfToken(sessionId);
  
  if (token.length !== expectedToken.length) return false;
  
  try {
    return crypto.timingSafeEqual(Buffer.from(token), Buffer.from(expectedToken));
  } catch (err) {
    logger.error('CSRF token validation error', err);
    return false;
  }
}

function csrfProtection(req, res, next) {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }
  
  if (!req.user || !req.user.id) {
    logger.warn("CSRF check failed: User not authenticated");
    return res.status(419).json({ error: 'Authentication required' });
  }
  
  const csrfToken = req.headers['x-csrf-token'];
  const sessionId = String(req.user.id);
  
  if (!validateCsrfToken(csrfToken, sessionId)) {
    logger.warn(`CSRF validation failed`, { user: req.user.login });
    return res.status(403).json({ error: 'Invalid CSRF token' });
  }
  
  next();
}

const db = mysql.createConnection({
  host: 'localhost',
  user: 'admin',
  password: 'Wojtek2008',
  database: 'hoserv'
});

db.connect((err) => {
    if (err) logger.error("Database connection failed", err);
    else logger.info("Database connected successfully");
});

// ======== Middleware ========

function verifyToken(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    logger.warn("VerifyToken: No token provided", { ip: req.ip });
    return res.sendStatus(401);
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    logger.warn("VerifyToken: Invalid token", { ip: req.ip, error: err.message });
    return res.sendStatus(403);
  }
}

// Multer config
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const userId = req.query.user || req.body.access;
    const folderName = req.query.folder || req.body.folder;
    
    logger.info("Multer destination start", { userId, folderName, file: file.originalname });

    if (!userId) {
        logger.error("Multer: Missing user/access parameter");
        return cb(new Error('Missing user/access parameter'));
    }
    
    if (!req.user) {
        logger.error("Multer: Unauthorized (no req.user)");
        return cb(new Error('Unauthorized'));
    }

    try {
      const [uRows] = await db.promise().query('SELECT db_main FROM users WHERE login = ?', [req.user.login]);
      if (!uRows.length) {
          logger.error("Multer: User not found in DB", { login: req.user.login });
          return cb(new Error('User not found'));
      }
      
      const allowedDbId = uRows[0].db_main;
      const targetDbId = parseStrictInteger(userId, 'userId');
      
      if (targetDbId !== allowedDbId && targetDbId !== 1) {
        logger.warn("Multer: Unauthorized upload destination attempt", { user: req.user.login, target: targetDbId });
        return cb(new Error('Unauthorized upload destination'));
      }
    } catch (err) { 
        logger.error("Multer: DB Error", err);
        return cb(err); 
    }

    const safeUserId = path.basename(String(userId));
    const safeFolderName = (folderName || '').replace(/^\/+/g, '');

    const userRoot = path.resolve(BASE_DIR, safeUserId);
    const userFolderPath = path.resolve(userRoot, safeFolderName);

    if (!userFolderPath.startsWith(userRoot)) {
      logger.warn("Multer: Path traversal attempt", { folderName });
      return cb(new Error('Invalid folder path'));
    }

    logger.info("Creating folder path", { path: userFolderPath });
    await fs.ensureDir(userFolderPath);
    cb(null, userFolderPath);
  },
  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '');
    logger.info("Multer: File sanitized", { original: file.originalname, safe: safeName });
    cb(null, Date.now() + '-' + safeName);
  }
});
const upload = multer({ storage });

// ======== API Endpoints ========

// POST: Login
app.post('/api/login', async (req, res) => {
  const { login } = req.body; // Don't destructure password for logging
  logger.info("Login attempt", { login });

  try {
    const { password } = req.body;
    const query = `SELECT id, login, password FROM users WHERE login = ?`;
    const [results] = await db.promise().query(query, [login]);

    if (results.length > 0) {
      const user = results[0];
      const match = await bcrypt.compare(password, user.password);

      if (match) {
        logger.info("Login successful", { login });
        const token = jwt.sign({ id: user.id, login: user.login }, JWT_SECRET, { expiresIn: '1h' });
        
        const csrfToken = generateCsrfToken(String(user.id));
        
        res.cookie('token', token, {
          httpOnly: true,
          sameSite: 'lax',
          secure: false,
          path: '/',
          maxAge: 60 * 60 * 1000
        });

        res.status(200).json({ 
          success: true,
          csrfToken 
        });
      } else {
        logger.warn("Login failed: Incorrect password", { login });
        res.status(401).json({ success: false, message: 'Nieprawidłowe dane logowania' });
      }
    } else {
        logger.warn("Login failed: User not found", { login });
        res.status(401).json({ success: false, message: 'Nieprawidłowe dane logowania' });
    }

  } catch (err) {
    logger.error("Login Server Error", err);
    res.status(500).json({ error: `Server error ${err}` });
  }
});

// GET: Return if logged in
app.get('/api/isLogged', (req, res) => {
  const hasToken = !!req.cookies.token;
  // logger.info("Check isLogged", { hasToken }); // Optional: might be too noisy
  if (!hasToken) res.status(200).json({ isLogged: false })
  else res.status(200).json({ isLogged: true })
});

// GET: About logged user
app.get('/api/me', verifyToken, (req, res) => {
  logger.info("Fetching /api/me", { user: req.user.login });
  const csrfToken = generateCsrfToken(String(req.user.id));
  res.json({ 
    user: req.user,
    csrfToken
  });
});

// GET: More about logged user
app.get('/api/user', verifyToken, async (req, res) => {
  logger.info("Fetching /api/user details", { user: req.user.login });
  try {
      const [result] = await db.promise().query(
        `SELECT login, db_main FROM users WHERE login = ?`,
        [req.user.login]
      );

      res.status(200).json({
        user: result[0].login,
        dbId: result[0].db_main
      });
  } catch (err) {
      logger.error("Error fetching /api/user", err);
      res.status(500).json({ error: "DB Error" });
  }
});

// POST: All photos
app.post('/api/photos', verifyToken, csrfProtection, async (req, res) => {
  const folder = req.body.folder || "";
  const dbName = req.body.db || "photos_general";

  logger.info("Fetching photos", { user: req.user.login, db: dbName, folder });

  if (!isValidTableName(dbName)) {
    logger.warn("Invalid table name requested", { dbName });
    return res.status(400).json({ error: "Invalid database name" });
  }

  try {
    const [uRows] = await db.promise().query('SELECT db_main FROM users WHERE login = ?', [req.user.login]);
    if (!uRows.length) return res.status(403).json({ error: "User not found" });
    const userDbId = uRows[0].db_main;
    const [dRows] = await db.promise().query('SELECT name FROM db_photos WHERE id = ?', [userDbId]);
    
    if (dbName !== dRows[0]?.name && dbName !== 'photos_general') {
      logger.warn("Unauthorized DB access attempt", { user: req.user.login, targetDb: dbName });
      return res.status(403).json({ error: "Unauthorized access to this database" });
    }

    if (folder) {
      const [dbRows] = await db.promise().query(
        `SELECT * FROM \`${dbName}\` WHERE folder = ?`,
        [folder]
      );
      res.status(200).json(dbRows);
      return;
    }

    const [dbRows] = await db.promise().query(`SELECT * FROM \`${dbName}\``);
    res.status(200).json(dbRows);

  } catch (err) {
    logger.error("Photos Fetch Error", err);
    res.status(500).json({ error: `Upload failed: ${err.sqlMessage ?? err.message}` });
  }
});

// POST: Search for photos
app.post('/api/search', verifyToken, csrfProtection, async (req, res) => {
  const folder = req.body.folder || "";
  const dbName = req.body.db || "photos_general";
  const search = req.body.search || "";
  const searchLike = '%' + search + '%';

  logger.info("Search request", { user: req.user.login, query: search, folder });

  if (!isValidTableName(dbName)) {
    return res.status(400).json({ error: "Invalid database name" });
  }

  try {
    const [uRows] = await db.promise().query('SELECT db_main FROM users WHERE login = ?', [req.user.login]);
    if (!uRows.length) return res.status(403).json({ error: "User not found" });
    const userDbId = uRows[0].db_main;
    const [dRows] = await db.promise().query('SELECT name FROM db_photos WHERE id = ?', [userDbId]);
    
    if (dbName !== dRows[0]?.name && dbName !== 'photos_general') {
      return res.status(403).json({ error: "Unauthorized access to this database" });
    }

    if (folder) {
      const [dbRows] = await db.promise().query(
        `SELECT * FROM \`${dbName}\` WHERE folder = ? and name LIKE ?`,
        [folder, searchLike]
      );
      res.status(200).json(dbRows);
      return;
    }

    const [dbRows] = await db.promise().query(
      `SELECT * FROM \`${dbName}\` WHERE name LIKE ?`,
      [searchLike]
    );
    res.status(200).json(dbRows);

  } catch (err) {
    logger.error("Search Error", err);
    res.status(500).json({ error: `Upload failed: ${err.sqlMessage ?? err.message}` });
  }
});

// POST: Log out
app.post('/api/logout', verifyToken, csrfProtection, (req, res) => {
  logger.info("User logout", { user: req.user.login });
  res.clearCookie('token');
  res.status(200).json({ success: true });
});

// POST: Upload photo
app.post('/api/addPhoto', verifyToken, csrfProtection, upload.array('files'), async (req, res) => {
  const access = req.body.access || req.query.user;
  const folder = req.body.folder || req.query.folder || "";

  logger.info("AddPhoto request processing", { user: req.user.login, folder, access });

  if (!access || !req.files || req.files.length === 0) {
    logger.warn("AddPhoto: Missing parameters or files");
    return res.status(400).json({ success: false, message: 'Proszę podać folder, dostęp lub zdjęcie/wideo.' });
  }

  try {
    const userId = parseStrictInteger(access, 'access');
    const files = req.files;

    const [uRows] = await db.promise().query('SELECT db_main FROM users WHERE login = ?', [req.user.login]);
    if (!uRows.length) return res.status(403).json({ error: "User not found" });
    const userDbId = uRows[0].db_main;
    
    if (userId !== userDbId && userId !== 1) {
      logger.warn("AddPhoto: Unauthorized DB write attempt", { user: req.user.login, targetId: userId });
      return res.status(403).json({ error: "Unauthorized access to this database" });
    }

    const [dbRows] = await db.promise().query(
      'SELECT name FROM `db_photos` WHERE id = ?',
      [userId]
    );

    if (dbRows.length === 0) return res.status(400).json({ error: "Invalid access ID" });
    const dbName = dbRows[0].name;

    if (!isValidTableName(dbName)) {
      throw new Error("Retrieved invalid DB name from database settings");
    }

    const query = `INSERT INTO \`${dbName}\` (\`name\`, \`date\`, \`user_id\`, \`folder\`, \`size\`, \`type\`) VALUES (?, ?, ?, ?, ?, ?)`;

    const insertionPromises = files.map(file => {
      const name = file.filename;
      const size = file.size;
      const type = file.mimetype;
      
      // === POPRAWKA DATY ===
      let dateObj = new Date(); // Domyślnie czas "teraz"
      const incomingDate = req.body.lastModified;

      if (incomingDate) {
        // Sprawdź czy to timestamp (same cyfry), wtedy zamień na liczbę
        const timestamp = Number(incomingDate);
        if (!isNaN(timestamp)) {
           dateObj = new Date(timestamp);
        } else {
           // Spróbuj stworzyć datę z tekstu
           const tryDate = new Date(incomingDate);
           // Sprawdź czy data jest poprawna (czy nie jest "Invalid Date")
           if (!isNaN(tryDate.getTime())) {
             dateObj = tryDate;
           }
        }
      }
      
      // Ostateczne zabezpieczenie - jeśli data nadal jest błędna, użyj "teraz"
      if (isNaN(dateObj.getTime())) {
        logger.warn("Received invalid date, falling back to current time", { invalidValue: incomingDate });
        dateObj = new Date();
      }

      const dateStr = dateObj.toISOString().slice(0, 19).replace('T', ' ');
      // =====================

      return db.promise().query(query, [name, dateStr, userId, folder, size, type]);
    });

    await Promise.all(insertionPromises);
    
    logger.info("AddPhoto success", { count: files.length, user: req.user.login });
    res.status(200).json({ success: true, count: files.length, message: `Dodano ${files.length} plików.` });

  } catch (err) {
    logger.error("AddPhoto Error", err);
    res.status(500).json({ error: `Upload failed: ${err.sqlMessage ?? err.message}` });
  }
});

// POST: Add a folder
app.post('/api/addFolder', verifyToken, csrfProtection, async (req, res) => {
  try {
    const folder = req.body.folder || req.query.folder;
    const id = parseStrictInteger(req.body.id || req.query.id, 'id');
    
    logger.info("AddFolder request", { user: req.user.login, folder, id });

    const [uRows] = await db.promise().query('SELECT db_main FROM users WHERE login = ?', [req.user.login]);
    const userDbId = uRows[0].db_main;
    
    if (id !== userDbId && id !== 1) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const queryCheck = `SELECT * FROM db_folders WHERE name = ? AND userId = ?`;
    const query = `INSERT INTO db_folders (\`name\`, \`userId\`) VALUES (?, ?)`;

    const [resultsCheck] = await db.promise().query(queryCheck, [folder, id]);
    if (resultsCheck.length != 0) {
      logger.warn("AddFolder: Folder exists", { folder });
      res.status(500).json({ error: "Folder o tej nazwie już istnieje!" });
      return;
    }
    const [results] = await db.promise().query(query, [folder, id]);
    logger.info("AddFolder success", { folder });
    res.status(200).json({ success: true });

  } catch (err) {
    logger.error("AddFolder Error", err);
    res.status(500).json({ error: `Upload failed: ${err.sqlMessage ?? err.message}` });
  }
});

// GET: Get usage info
app.get('/api/getUsage', verifyToken, async (req, res) => {
  try {
    // logger.info("GetUsage request", { user: req.user.login }); // Optional
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

    if (!isValidTableName(userDb.name)) throw new Error("Invalid DB structure");

    const [[userUsageRows]] = await db.promise().query(
      `SELECT SUM(size) AS totalSize FROM \`${userDb.name}\``
    );
    const userUsage = Number(userUsageRows.totalSize) || 0;

    const [allTableRows] = await db.promise().query('SELECT name FROM db_photos');
    const results = await Promise.all(
      allTableRows.map(row => {
        if (!isValidTableName(row.name)) return Promise.resolve([[{ totalSize: 0 }]]);
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
    logger.error("GetUsage Error", err);
    res.status(500).json({ error: `Server error ${err}` });
  }
});

// GET: Get DB names
app.get('/api/getDBs', verifyToken, async (req, res) => {
  try {
    const userLogin = req.user.login;

    const [userRows] = await db.promise().query(
      'SELECT db_main FROM users WHERE login = ?',
      [userLogin]
    );
    if (!userRows.length) return res.status(404).json({ error: 'User not found' });
    const userDbId = userRows[0].db_main;

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
    logger.error("GetDBs Error", err);
    res.status(500).json({ error: `Server error ${err}` });
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

    if (!isValidTableName(userDb.name)) throw new Error("Invalid Table");

    const [[userPhotos]] = await db.promise().query(
      `SELECT COUNT(*) AS count FROM \`${userDb.name}\``
    );

    const [[generalPhotos]] = await db.promise().query(
      'SELECT COUNT(*) AS count FROM photos_general'
    );

    const [allTables] = await db.promise().query('SELECT name FROM db_photos');

    let totalUsage = 0;
    for (const row of allTables) {
      const table = row.name;
      if (!isValidTableName(table)) continue;

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
    logger.error("GetPhotoCount Error", err);
    res.status(500).json({ error: `Server error ${err}` });
  }
});

app.post('/api/getDbTables', verifyToken, csrfProtection, async (req, res) => {
  try {
    const dbName = req.body.dbName;
    logger.info("GetDbTables", { user: req.user.login, dbName });

    if (!isValidTableName(dbName)) {
      return res.status(400).json({ error: "Invalid database name" });
    }
    
    const [uRows] = await db.promise().query('SELECT db_main FROM users WHERE login = ?', [req.user.login]);
    const userDbId = uRows[0].db_main;
    const [dRows] = await db.promise().query('SELECT name FROM db_photos WHERE id = ?', [userDbId]);
    
    if (dbName !== dRows[0].name && dbName !== 'photos_general') {
      logger.warn("GetDbTables: Unauthorized", { user: req.user.login });
      return res.status(403).json({ error: "Unauthorized" });
    }

    const sql = `SELECT DISTINCT folder FROM \`${dbName}\``;
    const [tableNames] = await db.promise().query(sql);

    res.status(200).json({
      success: true,
      tableNames: tableNames
    });

  } catch (err) {
    logger.error("GetDbTables Error", err);
    res.status(500).json({ error: `Server error ${err}` });
  }
});

app.post('/api/getFolders', verifyToken, csrfProtection, async (req, res) => {
  try {
    const access = parseStrictInteger(req.body.access, 'access');
    logger.info("GetFolders", { user: req.user.login, access });

    const [uRows] = await db.promise().query('SELECT db_main FROM users WHERE login = ?', [req.user.login]);
    const userDbId = uRows[0].db_main;
    
    if (access !== userDbId && access !== 1) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const query = `SELECT id, name FROM db_folders WHERE userId = ?`;
    const [result] = await db.promise().query(query, [access]);
    res.status(200).json({
      result: result
    });

  } catch (err) {
    logger.error("GetFolders Error", err);
    res.status(500).json({ error: `Server error ${err}` });
  }
});

app.post('/api/deletePhoto', verifyToken, csrfProtection, async (req, res) => {
  const { fileName, dbName } = req.body;
  logger.info("DeletePhoto initiated", { user: req.user.login, fileName, dbName });

  if (!fileName || !dbName) {
    return res.status(400).json({ error: "Missing fileName or dbName" });
  }

  if (!isValidTableName(dbName)) {
    return res.status(400).json({ error: "Invalid database name" });
  }

  const [uRows] = await db.promise().query('SELECT db_main FROM users WHERE login = ?', [req.user.login]);
  const userDbId = uRows[0].db_main;
  const [dRows] = await db.promise().query('SELECT name FROM db_photos WHERE id = ?', [userDbId]);
  
  if (dbName !== dRows[0].name && dbName !== 'photos_general') {
    logger.warn("DeletePhoto: Unauthorized DB", { user: req.user.login });
    return res.status(403).json({ error: "Unauthorized" });
  }

  try {
    const [rows] = await db.promise().query(
      `SELECT user_id, folder FROM \`${dbName}\` WHERE name = ?`,
      [fileName]
    );

    if (rows.length === 0) {
      logger.warn("DeletePhoto: Not found in DB", { fileName });
      return res.status(404).json({ error: "Photo not found in database" });
    }

    const photoData = rows[0];
    const safeUserId = String(photoData.user_id);
    const folderValue = photoData.folder !== null ? String(photoData.folder) : "";
    const safeFolder = folderValue.replace(/^\/+/g, '');

    const fileNameValue = fileName !== null ? String(fileName) : "";
    const safeFileName = path.basename(fileNameValue);
    
    const userRoot = path.resolve(BASE_DIR, safeUserId);
    const fileDir = path.resolve(userRoot, safeFolder);
    const filePath = path.join(fileDir, safeFileName);

    if (!fileDir.startsWith(userRoot)) {
      logger.error("DeletePhoto: Path traversal in DB record", { filePath });
      return res.status(400).json({ error: "Invalid folder path in DB" });
    }

    try {
      if (await fs.pathExists(filePath)) {
        await fs.remove(filePath);
        logger.info("DeletePhoto: File removed from disk", { filePath });
      } else {
        logger.warn("DeletePhoto: File not found on disk", { filePath });
      }
    } catch (fsError) {
      logger.error("DeletePhoto: File System Error", fsError);
      return res.status(500).json({ error: "Failed to delete file from disk" });
    }

    await db.promise().query(
      `DELETE FROM \`${dbName}\` WHERE name = ?`,
      [fileName]
    );
    
    logger.info("DeletePhoto: Success", { fileName });
    res.status(200).json({ success: true, message: "Photo deleted" });

  } catch (err) {
    logger.error("DeletePhoto Error", err);
    res.status(500).json({ error: ` ${err.message}` });
  }
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  logger.info(`HTTP Server running on port ${PORT}`);
});