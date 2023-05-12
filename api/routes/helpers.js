const connection = require("../db");
const { promisify } = require("util");

const query = promisify(connection.query).bind(connection);

/* 
Gets all users
@param No arguments needed
@return Array of users where each user is an object containing properties: id, first_name, last_name, user_role
*/
const getUsers = async () => {
    try {
        const sql = 'SELECT id, first_name, last_name, user_role from user';
        const result = await query(sql);
        return result;
    } catch (error) {
        throw error;
    };
};

/* 
Gets all tasks
@param No arguments needed
@return Array of tasks where each task is an object containing properties: id, task_name, task_status, date_completed, user_id
Summary not queried due to containing personal information
*/
const getTasks = async () => {
    try {
        const sql = 'SELECT id, task_name, task_status, date_completed, user_id FROM task';
        const result = await query(sql);
        return result;
    } catch (error) {
        throw error;
    };
};

/* 
Gets all tasks for a specific user
@param userId - id of specific user as integer
@return Array of tasks where each task is an object containing properties: id, task_name, summary, task_status, date_completed, user_id
*/
const getTasksByUser = async (userId) => {
    try {
        const sql = 'SELECT id, task_name, summary, task_status, date_completed, user_id FROM task WHERE user_id = ?';
        const result = await query(sql, userId);
        return result;
    } catch (error) {
        throw error;
    };
};

/* 
Creates new task
@param taskValues - array of values used as query values in sql query 
@return Object containing insertId
*/
const createTask = async (taskValues) => {
    try {
        const sql = 'INSERT INTO task (task_name, summary, user_id) VALUES (?, ?, ?)';
        const result = await query(sql, taskValues);
        return result;
    } catch (error) {
        throw error;
    };
};

/* 
Update specific task
@param taskId - id of task as integer
@param payload - object containing key value pairs of column and respective values to be updated
@return Object containing number of affected rows
*/
const updateTask = async (taskId, payload) => {
    try {
        const queryArr = buildSqlUpdateStr(taskId, payload);
        const sql = queryArr[0];
        const sqlValues = queryArr[1];

        const result = await query(sql, sqlValues);
        return result;
    } catch (error) {
        throw error;
    };
};

/* 
Notify manager
@param taskId - id of task as integer
@param payload - object containing key value pairs of column and respective values to be updated
@return No return. Prints a statement of task completion by relevant technician if task is marked to done

// TODO: Add logic to prevent redundant notifications
// TODO: Add functionality to notify, e.g. email notification
*/
const notifyManager = async (taskId, payload) => {
    if (payload?.taskStatus === 'done') {
        const sql = 'SELECT user.first_name AS first_name, user.last_name AS last_name, task.task_name AS task_name, task.date_completed AS date_completed FROM user INNER JOIN task ON user.id = task.user_id where task.id = ?'
        let data = await query(sql, taskId);

        data = JSON.parse(JSON.stringify(data[0]));
        
        const { first_name, last_name, task_name, date_completed } = data;
        const formattedDate = new Date(date_completed).toLocaleDateString();

        console.log(`The tech "${first_name} ${last_name}" performed the task "${task_name}" on date ${formattedDate}.`);
    };
};

/* 
Builds up SQL statement and query values for updateTask function
@param taskId - id of task as integer
@param payload - object containing key value pairs of column and respective values to be updated
@return Array containing sql statement string as first element and array of values for update as second element

// TODO: Find cleaner way to dynamically set values in updateTask
// TODO: Add functionality for date completed to populate
*/
const buildSqlUpdateStr = (taskId, payload) => {
    try {
        let sql = 'UPDATE task SET';
        let payloadArr = [];
        let sqlValues = [];
    
        const sqlMap = {
            taskName: ' task_name = ?,',
            summary: ' summary = ?,',
            taskStatus: ' task_status = ?,',
            dateCompleted: ' date_completed = ?,',
        };

        if ((taskId === null || taskId === undefined) || (Object.entries(payload).length === 0)) {
            throw new Error("Missing arguments in buildSqlUpdateStr");
        };

        // Conditions to make sure complete status and date completed are included together in payload
        if (payload?.taskStatus === 'done' && !payload?.dateCompleted) {
            throw new Error("Missing date_completed");
        } else if (payload?.dateCompleted && (payload?.taskStatus !== 'done' || !payload?.taskStatus) ){
            throw new Error("Missing done taskStatus");
        };

        for (const [key, value] of Object.entries(payload)) {
            payloadArr.push([key, value]);
        };
    
        for (let entry of payloadArr) {
            if (sqlMap[entry[0]]) {
                sql += sqlMap[entry[0]];
                sqlValues.push(entry[1]);
            };
        };
    
        let finalSql = sql.slice(0, sql.length - 1) + ' WHERE id = ?;'
        sqlValues.push(taskId);
    
        return [finalSql, sqlValues];
    } catch (error) {
        throw error;
    };
};

/* 
Delete specific task
@param taskId - id of task as integer
@return No return. For delete query operation, nothing is returned
*/
const deleteTask = async (taskId) => {
    try {
        const sql = 'DELETE from task WHERE id = ?';
        const result = await query(sql, taskId);
        return result;
    } catch (error) {
        throw error;
    };
};

module.exports = {
    getUsers,
    getTasks,
    getTasksByUser,
    createTask,
    updateTask,
    deleteTask,
    notifyManager,
    buildSqlUpdateStr
};