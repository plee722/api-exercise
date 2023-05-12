BEGIN;

USE api_db;

INSERT INTO user (id, first_name, last_name, user_role)
    VALUES (1, 'John', 'Doe', 'manager'),
        (2, 'Bob', 'Builder', 'technician'),
        (3, 'Jane', 'Welder', 'technician');

INSERT INTO task (task_name, summary, task_status, date_completed, user_id)
    VALUES ('clean office', 'mop floors', 'not started', null, 2),
        ('sand wood', 'finish off cabinets', 'in progress', null, 3),
        ('weld pipes', 'weld pipes for pipe factory', 'not started', null, 2),
        ('build shed', 'construct shed for farm', 'not started', null, 3),
        ('clean air vents', 'thorough deep clean of vents on floors 12- 15', 'done', '2023-05-05', 3);

COMMIT;