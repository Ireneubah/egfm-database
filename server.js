const express = require('express');
const { Pool } = require('pg');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
    origin: 'https://egfm-uk-db-f6b2e8e6c380.herokuapp.com/'
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
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

// Route to Serve the HTML Form
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Route to Handle Form Submissions
app.post('/submit', async (req, res) => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const { adultMembers, childMembers, address } = req.body;

        // Insert Adult Members and capture their IDs
        for (const adult of adultMembers) {
            const result = await client.query(
                `INSERT INTO root_data.adult_member (first_name, last_name, marital_status, email, telephone, dob, nationality, created_at)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
                 RETURNING id`,
                [adult.first_name, adult.last_name, adult.marital_status, adult.email, adult.phone, adult.dob, adult.nationality]
            );

            // Store the returned ID
            const memberId = result.rows[0].id;
            console.log('Inserted Adult Member ID:', memberId);

            // Insert Home Address for each adult member
            await client.query(
                `INSERT INTO root_data.address (member_id, address_line1, address_line2, city, postal_code, country)
                 VALUES ($1, $2, $3, $4, $5, $6)`,
                [
                    memberId,
                    address['address_line1'],
                    address['address_line2'],
                    address.city,
                    address.postcode,
                    address.country
                ]
            );
        }

        // Insert Child Members (assuming these don't need a member_id reference)
        for (const child of childMembers) {
            await client.query(
                `INSERT INTO root_data.child_member (first_name, last_name, dob, nationality)
                 VALUES ($1, $2, $3, $4)`,
                [child.first_name, child.last_name, child.dob, child.nationality]
            );
        }

        await client.query('COMMIT');
        res.status(200).send('Data submitted successfully');
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error inserting data:', error);
        res.status(500).send('Server error');
    } finally {
        client.release();
    }
});


// Start the Server
app.listen(PORT, () => {
    console.log('Server is running on port ${PORT}');
});