const express = require('express');
const { Client } = require('pg');
const app = express();

app.use(express.json());

const client = new Client({
    connectionString: process.env.DATABASE_URL, // Ensure this is set in Heroku config vars
    ssl: {
        rejectUnauthorized: false // Required for some Heroku PostgreSQL setups
    }
});

client.connect();

app.post('/submit', async (req, res) => {
    const { adultMembers, address } = req.body;

    try {
        // Loop through each adult member and insert into the adult_member table
        for (const adult of adultMembers) {
            const result = await client.query(
                `INSERT INTO root_data.adult_member (first_name, last_name, marital_status, email, telephone, dob, nationality)
                 VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
                [adult.first_name, adult.last_name, adult.marital_status, adult.email, adult.phone, adult.dob, adult.nationality]
            );

            const memberId = result.rows[0].id; // Retrieve the generated id for this adult member

            // Insert the address using the generated memberId
            await client.query(
                `INSERT INTO root_data.address (member_id, address_line1, address_line2, city, postal_code, country)
                 VALUES ($1, $2, $3, $4, $5, $6)`,
                [memberId, address.address_line1, address.address_line2, address.city, address.postcode, address.country]
            );
        }

        res.status(200).send('Registration submitted successfully!');
    } catch (error) {
        console.error('Error inserting data:', error);
        res.status(500).send('Error submitting registration.');
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
