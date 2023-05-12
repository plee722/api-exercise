# API Exercise with NodeJS, Express, MySQL, and Docker

## Context
* You are developing a software to account for maintenance tasks performed during a
working day. This application has two types of users (Manager, Technician).
* The technician performs tasks and is only able to see, create or update his own
performed tasks.
* The manager can see tasks from all the technicians, delete them, and should be
notified when some tech performs a task.
* A task has a summary (max: 2500 characters) and a date when it was performed, the
summary from the task can contain personal information.

## MVP Features
* Create API endpoint to save a new task. - Completed
* Create API endpoint to list tasks. - Completed
* Notify manager of each task performed by the tech. (This notification can be just a print saying “The tech X performed the task Y on date Z”) - Completed
* This notification should not block any http request. - Completed

## Getting Started
1. Install dependencies with `npm install`.
2. If not already on local machine, download Docker for Desktop (https://www.docker.com/products/docker-desktop/) and start Docker application.
3. To spin up app in Docker container, first run `docker compose build` and then run `docker compose up`. This will create the local dev environment in a docker container with the MySQL database.
4. After Docker containers are up, go to localhost:8080.

## API Endpoints
* GET: /api/tasks, /api/tasks/user/:userId, /api/users

To view users and tasks in browser, these are the following GET endpoints: /api/tasks, /api/tasks/user/:userId, /api/users. You can visit these URL paths or use a curl command like below.
```
curl -X GET http://localhost:8080/api/tasks -H "Content-Type: application/json" -d ''
```

* POST: /api/tasks/:taskId

To add a task, use a curl command for the POST route like the example below. The fields taskName, summary, and userId are all required.
```
curl -X POST http://localhost:8080/api/tasks -H "Content-Type: application/json" -d '{"taskName": "test task 1", "summary": "task 1 summary", "userId": 2}'
```

* PUT: /api/tasks/:taskId

To update an existing task, use a curl command for the PUT route like below. The fields are taskName, summary, task_status, date_completed. Not all are necessary to make a successful update. However, at least one field is needed. If date_completed or task_status with value "done" is in curl, the other field must be included with a value.
```
curl -X PUT http://localhost:8080/api/tasks/user/3 -H "Content-Type: application/json" -d '{"taskName": "test task 1", "summary": "task 1 summary", "taskStatus": "done", "dateCompleted": "2023-05-10", "userId": 3 }'
```

* DELETE: /api/tasks/:taskId

To delete an existing task, use a curl method for the DELETE route like below. This command takes no payload.
```
curl -X DELETE http://localhost:8080/api/tasks/2 -H "Content-Type: application/json" -d ''
```

* Database contains the schema below in schema.sql file:

**User**
CREATE TABLE IF NOT EXISTS user (
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    user_role ENUM('manager', 'technician'),
    PRIMARY KEY (id)
);

**Task**
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

## Future features to add
* Use a message broker to decouple notification logic from the application flow
* Create Kubernetes object files needed to deploy this application
* Get single, create, and delete functionality for users
* More tests (Current tests are more integration-related as they use active DB connection)
* Utilize authentication to limit route calls to technician or manager only (Possible solutions include using JWT or sessions)
* Hide credentials in env file or using storage like database or key vault
* Add POST, PUT, and DELETE routes for user table

## What I would do differently in future
* Use Service-Repository pattern to setup User and Task as separate services
* Abstract the helper function logic to be more modular (Helper functions are more specific right now and may be repetitive)
* Use an Object Relational Mapper (e.g. Knex or Sequelize) to leverage built-in methods for cleaner query logic - Straight SQL was used to demonstrate familiarity
* Modularize code more to allow for easier unit testing

## Security concerns
* SQL injection attacks - https://github.com/mysqljs/mysql#escaping-query-values This was used to protect SQL queries
* Salt and hash passwords during authentication
* Limiting route calls to specific roles
* Exposed credentials

## Tools used
* express - library for handling route requests and setting up node.js server
* mysql - relational database management system that utilizes SQL
* nodemon - monitors source code and automatically reflects changes in server
* superagent - http client library used to make requests
* jest - testing framework
* supertest - HTTP assertion library
* babel-cli - CLI to compile files from command line
* babel-preset-env - Babel preset that compiles ES2015+ JavaScript down to ES5
* docker - tool to automate deployment of applications in containerized environments

## App Organization
- Backend
  - The api directory contains the API route logic for users and tasks in addition to api/index.js where the routers are consolidated via router. Also contained is the database configuration for MySQL.
  - The test directory contains test files for users and tasks (WIP).
  - The root directory contains the Dockerfile and docker-compose files for spinning up the Docker containers for the application and MySQL database. The schema and seed files are the MySQL database are also located here. The app is initialized in app.js which also contains necessary middleware, and the server port is started in server.js.
