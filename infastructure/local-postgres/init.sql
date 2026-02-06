CREATE DATABASE users_db;
CREATE DATABASE tasks_db;

\c users_db

CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(255) PRIMARY KEY,
    user_name VARCHAR(255) NOT NULL
);

\c tasks_db

CREATE TABLE IF NOT EXISTS tasks (
    id VARCHAR(255) PRIMARY KEY,
    summary VARCHAR(255) NOT NULL,
    details TEXT NOT NULL,
    creation_date TIMESTAMP NOT NULL,
    updated_date TIMESTAMP NOT NULL,
    assignee_id VARCHAR(255) REFERENCES users(id),
    reporter_id VARCHAR(255) REFERENCES users(id),
    super_task REFERENCES tasks(id)
);