const express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files (HTML, CSS, JS)

// PostgreSQL Connection Pool
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

// Test Database Connection
pool.connect()
    .then(() => console.log('Connected to the database'))
    .catch(err => console.error('Database connection error', err));

// Route to Handle Form Submissions
app.post('/submit', async (req, res) => {
    try {
        const { adultMembers, childMembers, address } = req.body;

        // Insert Adult Members
        for (const adult of adultMembers) {
            await pool.query(
                `INSERT INTO adult_member (first_name, last_name, marital_status, email, telephone, dob, nationality, created_at)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())`,
                [adult.first_name, adult.last_name, adult.marital_status, adult.email, adult.phone, adult.dob, adult.nationality]
            );
        }

        // Insert Child Members
        for (const child of childMembers) {
            await pool.query(
                `INSERT INTO child_member (first_name, last_name, dob, nationality)
                 VALUES ($1, $2, $3, $4)`,
                [child.first_name, child.last_name, child.dob, child.nationality]
            );
        }

        // Insert Home Address (assuming one address per submission)
        await pool.query(
            `INSERT INTO home_address (postcode, city, country)
             VALUES ($1, $2, $3)`,
            [address.postcode, address.city, address.country]
        );

        res.status(200).send('Data submitted successfully');
    } catch (error) {
        console.error('Error inserting data:', error);
        res.status(500).send('Server error');
    }
});

// Start the Server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
