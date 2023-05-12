const connection = require("../../db");
const { promisify } = require("util");

const query = promisify(connection.query).bind(connection)

// Gets all users
const getUsers = async () => {
    try {
        const sql = 'SELECT * from user';
        const result = await query(sql);
        return result;
    } catch (error) {
        throw error
    }
};

// Gets all tasks
const getTasks = async () => {
    try {
        const sql = 'SELECT * FROM task';
        const result = await query(sql);
        return result;
    } catch (error) {
        throw error
    }
};

// Gets all tasks for a specific user
const getTasksByUser = async (userId) => {
    try {
        const sql = 'SELECT * FROM task WHERE user_id = ?';
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

        const result = await query(queryArr[0], queryArr[1]);
        return result;

    } catch (error) {
        throw error;
    };
};

// TODO: Find cleaner way to dynamically set values in updateTask
// TODO: Add functionality for date completed to populate
// Builds up SQL statement and query values for updateTask
const buildSqlUpdateStr = (taskId, payload) => {
    try {
        let sql = 'UPDATE task SET ';
        let payloadArr = [];
        let sqlValues = [];
    
        const sqlMap = {
            taskName: 'task_name = ?,',
            summary: 'summary = ?,',
            taskStatus: 'task_status = ?,',
            dateCompleted: 'date_completed = ?,',
            userId: 'user_id = ?,'
        };

        for (const [key, value] of Object.entries(payload)) {
            payloadArr.push([key, value])
        };
    
        for (let entry of payloadArr) {
            if (sqlMap[entry[0]]) {
                sql += sqlMap[entry[0]];
                sqlValues.push(entry[1]);
            }
        }
    
        let finalSql = sql.slice(0, sql.length - 1) + ' WHERE id = ?;'
        sqlValues.push(taskId);
    
        return [finalSql, sqlValues];
    } catch (error) {
        throw error;
    }
};

// Delete task
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
    deleteTask
};