const request = require("supertest");
const app = require("../app");
const connection = require("../api/db");
const { buildSqlUpdateStr } = require("../api/routes/helpers");

describe("Task helpers", () => {
    describe("Build SQL string for update route", () => {
        test("It should return an array with two elements", () => {
            const taskId = 3;
            const testPayload = { "taskName": "cleaning", "summary": "this is a test" };

            const result = buildSqlUpdateStr(taskId, testPayload);

            expect(Array.isArray(result)).toBeTruthy();
            expect(result.length).toBe(2);
        });

        test("The return array should be an array containing a string and array in that order", () => {
            const taskId = 3;
            const testPayload = { "taskName": "cleaning", "summary": "this is a test" };

            const result = buildSqlUpdateStr(taskId, testPayload);

            expect(typeof result[0]).toBe('string');
            expect(Array.isArray(result[1])).toBeTruthy();
        });

        test("It should throw an error if taskId is undefined", () => {
            const testPayload = { "taskName": "cleaning", "summary": "this is a test" };

            expect(() => { buildSqlUpdateStr(undefined, testPayload);
            }).toThrow();
        });

        test("It should throw an error if taskId is undefined", () => {
            const taskId = 4;
            const testPayload = {};

            expect(() => { buildSqlUpdateStr(taskId, testPayload);
            }).toThrow();
        });

        test("It should return an array with two elements", () => {
            const taskId = 3;
            const testPayload = { "taskName": "cleaning", "summary": "this is a test" };

            const result = buildSqlUpdateStr(taskId, testPayload);

            expect(Array.isArray(result)).toBeTruthy();
            expect(result.length).toBe(2);
        });

        test("It should return a valid query string and an array of query values", () => {
            const taskId = 3;
            const testPayload = { "taskName": "cleaning", "summary": "this is a test" };

            const result = buildSqlUpdateStr(taskId, testPayload);

            expect(result[0]).toEqual("UPDATE task SET task_name = ?, summary = ? WHERE id = ?;");
            expect(result[1]).toEqual(["cleaning", "this is a test", 3]);
        });
    });
});


/*
Integration testing requiring active DB connection (Not currently working)
TODO: Setup local MySQL connection
TODO: Add unit tests for routes possibly using mock DB and SQL calls
*/

// describe("Task routes", () => {
//     beforeEach(() => {
//         connection.connect((error) => {
//             if (error) {
//                 console.error(`error connecting: ${error.stack}`);
//                 return;
//             };
    
//             console.log(`connected as id ${connection.threadId}`);
//         });
//     });
    
//     afterEach(() => {
//         connection.end((error) => {
//             if (error) {
//                 console.error(`error disconnecting: ${error.stack}`);
//                 return;
//             };
//         });
//     });
    
//     describe("GET route for all tasks", () => {
//         test("It should return an array of items", async () => {
//             const response = await request(app).get("/api/tasks");

//             expect(response.statusCode).toBe(200);
//             expect(response.body.length).toBeGreaterThan(0);
//         });
//     });
    
//     describe("GET route for tasks by specific userId", () => {
//         test("It should return an array of items", async () => {
//             const response = await request(app).get("/api/tasks/user/2");

//             expect(response.statusCode).toBe(200);
//             expect(response.body.length).toEqual(2);
//         });
//     });
    
//     describe("POST route to create new task", () => {
//         test("It should return a 201 and data about new row", async () => {
//             const payload = {"taskName": "test task 1", "summary": "task 1 summary", "userId": 2};

//             const response = await request(app).post("/api/tasks")
//                 .send(payload)
//                 .set('Content-Type', 'application/json')
//                 .set('Accept', 'application/json');

//             expect(response.statusCode).toBe(201);
//             expect(response.body.task.insertId).toEqual(6);
//         });

//         test("It should successfully add a new task", async () => {
//             const response = await request(app).get("/api/tasks/user/2");

//             expect(response.body.length).toEqual(3);
//         });
//     });
    
//     describe("PUT route to update specific task", () => {
//         test("It should return a 200 and number of updated rows", async () => {
//             const payload = { "taskName": "test task 1", "summary": "task 1 summary", "taskStatus": "done", "dateCompleted": "2023-05-10", "userId": 2 };
//             const response = await request(app).put("/api/tasks/user/2")
//                 .send(payload)
//                 .set('Content-Type', 'application/json')
//                 .set('Accept', 'application/json');

//             expect(response.statusCode).toBe(200);
//             expect(response.body.task.affectedRows).toEqual(1);
//         });
//     });

//     describe("DELETE route to delete specific task", () => {
//         test("It should return a 204", async () => {
//             const response = await request(app).delete("/api/tasks/2");

//             expect(response.statusCode).toBe(204);
//         });

//         test("It should remove an existing task from the database", async () => {
//             const response = await request(app).get("/api/tasks");

//             expect(response.statusCode).toBe(200);
//             expect(response.body.length.toBe(4));
//         });
//     });
// });
