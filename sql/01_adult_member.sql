CREATE TABLE adult_member (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    marital_status VARCHAR(20),
    email VARCHAR(100) UNIQUE,
    telephone VARCHAR(20),
    dob DATE,
    age INT GENERATED ALWAYS AS (DATE_PART('year', CURRENT_DATE) - DATE_PART('year', dob) 
                                - CASE WHEN to_char(dob, 'MMDD') > to_char(CURRENT_DATE, 'MMDD') THEN 1 ELSE 0 END) STORED,
    nationality VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);