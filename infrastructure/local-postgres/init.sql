CREATE DATABASE tasks_db;

\c tasks_db

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY,
    user_name VARCHAR(255) NOT NULL UNIQUE
);

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'task_status') THEN
        CREATE TYPE task_status AS ENUM ('TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE', 'CANCELLED');
    END IF;
END$$;

CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY,
    code VARCHAR(50) NOT NULL,
    status task_status NOT NULL,
    summary TEXT NOT NULL,
    details TEXT,
    creation_date TIMESTAMP NOT NULL,
    updated_date TIMESTAMP NOT NULL,
    due_date TIMESTAMP,
    assignee_id UUID REFERENCES users(id),
    reporter_id UUID REFERENCES users(id),
    super_task UUID REFERENCES tasks(id)
);

-- Insert placeholder users
INSERT INTO users (id, user_name) VALUES
    ('1b8abcaa-e5e9-47e6-a3ce-49e3f044fc51', 'Alice'),
    ('1d6b48e1-64ae-40fd-bde1-b4da08a32fc8', 'Bob'),
    ('2c9f1e5a-8b3d-4f1a-9c2e-5d6f7a8b9c0d', 'Unassigned');

-- Insert placeholder tasks
INSERT INTO tasks (id, code, status, summary, details, creation_date, updated_date, due_date, assignee_id, reporter_id, super_task)
VALUES
    ('ecdfca84-f42d-44fd-96e7-6980244ece70', 'TASK-001', 'TODO', 'First Task', 'This is a placeholder task.', NOW(), NOW(), NULL, '1b8abcaa-e5e9-47e6-a3ce-49e3f044fc51', '1d6b48e1-64ae-40fd-bde1-b4da08a32fc8', NULL),
    ('246817f1-d84b-4de9-985f-8714e04ae70f', 'TASK-002', 'IN_PROGRESS', 'Second Task', 'Another placeholder task.', NOW(), NOW(), NOW(), '1d6b48e1-64ae-40fd-bde1-b4da08a32fc8', '1b8abcaa-e5e9-47e6-a3ce-49e3f044fc51', NULL);