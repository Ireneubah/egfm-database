const express = require('express');
const pool = require('./db');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON data
app.use(express.json());

// Test route to check database connection
app.get('/test', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ message: 'Database connected!', time: result.rows[0] });
  } catch (error) {
    console.error('Error connecting to the database:', error);
    res.status(500).send('Database connection error');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
