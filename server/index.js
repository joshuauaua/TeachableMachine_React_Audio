const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' })); // Increase limit for large spectrogram data
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Database Setup
const dbPath = path.resolve(__dirname, 'recordings.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    createTable();
  }
});

function createTable() {
  db.run(`CREATE TABLE IF NOT EXISTS recordings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        modelName TEXT,
        classes TEXT,
        spectrogramData TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
    if (err) {
      console.error('Error creating table', err.message);
    } else {
      console.log('Recordings table ready.');
    }
  });
}

// Routes

// Save a recording
app.post('/api/recordings', (req, res) => {
  const { modelName, classes, spectrogramData } = req.body;

  if (!modelName || !classes || !spectrogramData) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const sql = `INSERT INTO recordings (modelName, classes, spectrogramData) VALUES (?, ?, ?)`;
  const params = [modelName, JSON.stringify(classes), JSON.stringify(spectrogramData)];

  db.run(sql, params, function (err) {
    if (err) {
      console.error('Error inserting recording', err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json({
      message: 'Recording saved successfully',
      id: this.lastID
    });
  });
});

// Get all recordings (basic list)
app.get('/api/recordings', (req, res) => {
  const sql = "SELECT id, modelName, classes, timestamp FROM recordings ORDER BY timestamp DESC";
  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({
      message: "success",
      data: rows
    });
  });
});

// Get specific recording
app.get('/api/recordings/:id', (req, res) => {
  const sql = "SELECT * FROM recordings WHERE id = ?";
  const params = [req.params.id];
  db.get(sql, params, (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Recording not found' });
    }
    // Parse JSON strings back to objects
    row.classes = JSON.parse(row.classes);
    row.spectrogramData = JSON.parse(row.spectrogramData);

    res.json({
      message: "success",
      data: row
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
