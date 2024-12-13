CREATE TABLE root_data.child_guardian (
    child_id INT NOT NULL,
    guardian_id INT NOT NULL,
    PRIMARY KEY (child_id, guardian_id),
    FOREIGN KEY (child_id) REFERENCES root_data.child_member(id) ON DELETE CASCADE,
    FOREIGN KEY (guardian_id) REFERENCES root_data.adult_member(id) ON DELETE CASCADE
);
