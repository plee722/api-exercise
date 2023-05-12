// const request = require("supertest");
// const app = require("../server");
// const connection = require("../api/db");

/*
Integration testing requiring active DB connection (Not currently working)
TODO: Setup local MySQL connection
TODO: Add unit tests for routes possibly using mock DB and SQL calls
*/

// describe("User routes", () => {
//     beforeAll(() => {
//         connection.connect((error) => {
//             if (error) {
//                 console.error(`error connecting: ${error.stack}`);
//                 return;
//             };
    
//             console.log(`connected as id ${connection.threadId}`);
//         });
//     });
    
//     afterAll(() => {
//         connection.end((error) => {
//             if (error) {
//                 console.error(`error disconnecting: ${error.stack}`);
//                 return;
//             };
//         });
//     });
    
//     describe("GET route for all users", () => {
//         test("It should return an array of items", async () => {
//             const response = await request(app).get("/api/users");

//             expect(response.statusCode).toBe(200);
//             expect(response.body.length).toBeGreaterThan(0);
//         });
//     });
// });