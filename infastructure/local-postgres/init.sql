CREATE DATABASE tasks_db;

\c tasks_db

CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(255) PRIMARY KEY,
    user_name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS tasks (
    id VARCHAR(255) PRIMARY KEY,
    summary VARCHAR(255) NOT NULL,
    details TEXT NOT NULL,
    creation_date TIMESTAMP NOT NULL,
    updated_date TIMESTAMP NOT NULL,
    assignee_id VARCHAR(255) REFERENCES users(id),
    reporter_id VARCHAR(255) REFERENCES users(id),
    super_task VARCHAR(255) REFERENCES tasks(id)
);

-- Insert placeholder users
INSERT INTO users (id, user_name) VALUES
    ('1b8abcaa-e5e9-47e6-a3ce-49e3f044fc51', 'Alice'),
    ('1d6b48e1-64ae-40fd-bde1-b4da08a32fc8', 'Bob');

-- Insert placeholder tasks
INSERT INTO tasks (id, summary, details, creation_date, updated_date, assignee_id, reporter_id, super_task)
VALUES
        ('ecdfca84-f42d-44fd-96e7-6980244ece70', 'First Task', 'This is a placeholder task.', NOW(), NOW(), '1b8abcaa-e5e9-47e6-a3ce-49e3f044fc51', '1d6b48e1-64ae-40fd-bde1-b4da08a32fc8', NULL),
        ('246817f1-d84b-4de9-985f-8714e04ae70f', 'Second Task', 'Another placeholder task.', NOW(), NOW(), '1d6b48e1-64ae-40fd-bde1-b4da08a32fc8', '1b8abcaa-e5e9-47e6-a3ce-49e3f044fc51', NULL);