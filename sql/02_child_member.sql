CREATE TABLE root_data.child_member (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    dob DATE,
    age INT GENERATED ALWAYS AS (DATE_PART('year', CURRENT_DATE) - DATE_PART('year', dob) 
                                - CASE WHEN to_char(dob, 'MMDD') > to_char(CURRENT_DATE, 'MMDD') THEN 1 ELSE 0 END) STORED,
    nationality VARCHAR(50),
);