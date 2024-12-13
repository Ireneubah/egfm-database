CREATE SCHEMA root_data

CREATE TABLE root_data.adult_member (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    marital_status VARCHAR(20),
    email VARCHAR(100) UNIQUE,
    telephone VARCHAR(20),
    dob DATE,
    nationality VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);