BEGIN;

DROP DATABASE IF EXISTS test_db;
CREATE DATABASE test_db;
USE test_db;

CREATE TABLE IF NOT EXISTS user (
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    user_role ENUM('manager', 'technician'),
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS task (
    id INT NOT NULL AUTO_INCREMENT,
    task_name VARCHAR(255) NOT NULL,
    summary VARCHAR(2500) NOT NULL,
    task_status ENUM('not started', 'in progress', 'done') DEFAULT 'not started',
    date_completed DATE DEFAULT NULL,
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user (id),
    PRIMARY KEY (id)
);

COMMIT;