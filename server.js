const express = require('express');
const { Pool } = require('pg');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
    origin: process.env.ALLOWED_ORIGIN
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

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

// --- Server-Side Validation Functions ---

// Function to validate email format
function isValidEmail(email) {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
}

// Function to check if a date is valid
function isValidDate(dateString) {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
}

// Function to check if DOB indicates adult (18+ years)
function isAdult(dob) {
    if (!isValidDate(dob)) return false;
    const birthDate = new Date(dob);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        return age - 1 >= 18;
    }
    return age >= 18;
}

// Validation function for adult members
function validateAdult(adult) {
    if (!adult.first_name || adult.first_name.trim() === '' || /\d/.test(adult.first_name)) {
        return 'Invalid first name';
    }
    if (!adult.last_name || adult.last_name.trim() === '' || /\d/.test(adult.last_name)) {
        return 'Invalid last name';
    }
    if (!adult.email || adult.email.trim() === '' || !isValidEmail(adult.email)) {
        return 'Invalid email';
    }
    if (!adult.dob || adult.dob.trim() === '' || !isAdult(adult.dob)) {
        return 'Invalid date of birth or age';
    }
    if (!adult.phone || adult.phone.trim() === '') {
        return 'Invalid phone number';
    }
    return null; // Return null if no validation errors
}

// Validation function for child members
function validateChild(child) {
    if (!child.first_name || child.first_name.trim() === '' || /\d/.test(child.first_name)) {
        return 'Invalid first name';
    }
    if (!child.last_name || child.last_name.trim() === '' || /\d/.test(child.last_name)) {
        return 'Invalid last name';
    }
    if (!child.dob || child.dob.trim() === '') {
        return 'Invalid date of birth';
    }
    return null; // Return null if no validation errors
}

// Validation function for address
function validateAddress(address) {
    if (!address.address_line1 || address.address_line1.trim() === '') {
        return 'Invalid address line 1';
    }
    if (!address.address_line2 || address.address_line2.trim() === '') {
        return 'Invalid address line 2';
    }
    if (!address.city || address.city.trim() === '') {
        return 'Invalid city';
    }
    if (!address.country || address.country.trim() === '') {
        return 'Invalid country';
    }
    return null; // Return null if no validation errors
}

// Route to Handle Form Submissions
app.post('/submit', async (req, res) => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const { adultMembers, childMembers, address } = req.body;

        // Validate all members before inserting
        const validationErrors = [];
        for (const adult of adultMembers) {
            const error = validateAdult(adult);
            if (error) {
                validationErrors.push(error);
            }
        }
        for (const child of childMembers) {
            const error = validateChild(child);
            if (error) {
                validationErrors.push(error);
            }
        }
        const addressError = validateAddress(address);
        if (addressError) {
            validationErrors.push(addressError);
        }

        // If validation errors exist, send back a 400 response
        if (validationErrors.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: validationErrors
            });
        }

        // If no validation errors, proceed with data insertion
        const adultIds = [];
        for (const adult of adultMembers) {
            try {
                const result = await client.query(
                    `INSERT INTO root_data.adult_member (first_name, last_name, email, telephone, dob, gender,referral, created_at)
                     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
                     RETURNING id`,
                    [adult.first_name, adult.last_name, adult.email, adult.phone, adult.dob, adult.gender,adult.referral]
                );

                const memberId = result.rows[0].id;
                console.log('Inserted Adult Member ID:', memberId);
                adultIds.push(memberId);
            } catch (error) {
                // Check if the error is a unique constraint violation
                if (error.code === '23505') {
                    // Redirect to a new HTML page for duplicate entry
                    return res.status(200).json({ success: true, redirectUrl: '/duplicate.html' });
                } else {
                    throw error; // Re-throw the error if it's not a unique constraint violation
                }
            }
        }

        // Insert Child Members and capture their IDs
        const childIds = [];
        for (const child of childMembers) {
            const result = await client.query(
                `INSERT INTO root_data.child_member (first_name, last_name, dob, gender)
                 VALUES ($1, $2, $3, $4)
                 RETURNING id`,
                [child.first_name, child.last_name, child.dob, child.gender]
            );

            const childId = result.rows[0].id;
            console.log('Inserted Child Member ID:', childId);
            childIds.push(childId);
        }

        // Insert relationships into child_guardian table
        for (const childId of childIds) {
            for (const guardianId of adultIds) {
                await client.query(
                    `INSERT INTO root_data.child_guardian (child_id, guardian_id)
                     VALUES ($1, $2)`,
                    [childId, guardianId]
                );
                console.log(`Linked Child ID ${childId} to Guardian ID ${guardianId}`);
            }
        }

        // Insert Home Address for all adult members
        for (const adultId of adultIds) {
            await client.query(
                `INSERT INTO root_data.address (member_id, address_line1, address_line2, city, postal_code, country)
                 VALUES ($1, $2, $3, $4, $5, $6)`,
                [
                    adultId,
                    address.address_line1,
                    address.address_line2,
                    address.city,
                    address.postcode,
                    address.country
                ]
            );
            console.log(`Inserted Address for Adult Member ID ${adultId}`);
        }

        await client.query('COMMIT');
        res.status(200).json({ success: true, redirectUrl: '/success.html' });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error during form submission:', error);

        // Handle other errors
        res.status(500).json({ success: false, message: 'An error occurred during form submission.' });
    } finally {
        client.release();
    }
});

// Start the Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});