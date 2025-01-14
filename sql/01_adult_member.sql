CREATE SCHEMA root_data

CREATE OR REPLACE TABLE root_data.adult_member (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE,
    telephone VARCHAR(20),
    dob DATE,
    gender ENUM('Male', 'Female') NOT NULL,
    referral VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);