const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: '43.200.174.173',
  user: 'test',
  password: '1234',
  database: 'coding',
});

app.get('/', (req, res) => {
  return res.send('From Client');
});

app.get('/users', (req, res) => {
  db.query;
});

app.listen(3001, () => {
  console.log('Server is running on port 3001');
});
