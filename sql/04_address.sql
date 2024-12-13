CREATE TABLE root_data.address (
    id SERIAL PRIMARY KEY,
    member_id INT NOT NULL,
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    country VARCHAR(100) NOT NULL,
    FOREIGN KEY (member_id) REFERENCES adult_member(id) ON DELETE CASCADE
);
