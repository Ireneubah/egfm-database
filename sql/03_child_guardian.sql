CREATE TABLE root_data.child_guardian (
    child_id INT NOT NULL,
    guardian_id INT NOT NULL,
    PRIMARY KEY (child_id, guardian_id),
    FOREIGN KEY (child_id) REFERENCES child_member(id) ON DELETE CASCADE,
    FOREIGN KEY (guardian_id) REFERENCES adult_member(id) ON DELETE CASCADE
);
