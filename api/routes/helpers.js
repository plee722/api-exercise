const connection = require("../db");
const { promisify } = require("util");

const query = promisify(connection.query).bind(connection);

// Gets all users
const getUsers = async () => {
    try {
        const sql = 'SELECT id, first_name, last_name, user_role from user';
        const result = await query(sql);
        return result;
    } catch (error) {
        throw error;
    };
};

// Gets all tasks (not querying the summary due to personal information)
const getTasks = async () => {
    try {
        const sql = 'SELECT id, task_name, task_status, date_completed, user_id FROM task';
        const result = await query(sql);
        return result;
    } catch (error) {
        throw error
    }
};

// Gets all tasks for a specific user
const getTasksByUser = async (userId) => {
    try {
        const sql = 'SELECT id, task_name, summary, task_status, date_completed, user_id FROM task WHERE user_id = ?';
        const result = await query(sql, userId);
        return result;
    } catch (error) {
        throw error
    }
};

// Creates new task
const createTask = async (taskValues) => {
    try {
        const sql = 'INSERT INTO task (task_name, summary, user_id) VALUES (?, ?, ?)';
        const result = await query(sql, taskValues);
        return result;
    } catch (error) {
        throw error;
    };
};

// Updates specific task
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

// TODO: Add logic to prevent redundant notifications
// TODO: Add functionality to notify, e.g. email notification
// Notify manager (currently just a print statement)
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

// TODO: Find cleaner way to dynamically set values in updateTask
// TODO: Add functionality for date completed to populate
// Builds up SQL statement and query values for updateTask
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

        for (const [key, value] of Object.entries(payload)) {
            payloadArr.push([key, value])
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
    }
};

// Delete specific task
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