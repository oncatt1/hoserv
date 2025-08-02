const express = require('express');
const cors = require('cors'); 
const mysql = require('mysql2');
const app = express();

app.use(cors());
const db = mysql.createConnection({
  host: 'localhost',
  user: 'admin',
  password: 'Wojtek2008',
  database: 'hoserv'
});

// gets the photos
app.get('/api/photos', (req, res) => {
  db.query('SELECT * FROM general', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});
//gets the folder list 

//login system
app.post('/api/login', (req, res) => {
  let login = req.body.login
  let password = req.body.password
  let query = 'COUNT(*) from users WHERE login = ' + login + 'AND password = ' + password + ';'
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  })
})

app.listen(3000, '0.0.0.0', () => {
  console.log('Server running on port 3000');
});
