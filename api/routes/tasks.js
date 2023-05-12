const router = require("express").Router();
const { getTasks, getTasksByUser, createTask, updateTask, deleteTask, notifyManager } = require("./helpers");

// GET route for all tasks
router.get("/", async (req, res, next) => {
    try {
        const data = await getTasks();
        res.status(200).json({ users: data });  
    } catch (error) {
        next(error);
    };   
});

// GET route for all tasks by specific userId
router.get("/user/:userId", async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const data = await getTasksByUser(userId);
        res.status(200).json({ users: data });  
    } catch (error) {
        next(error);
    }; 
});

// POST route to create new task
router.post("/", async (req, res, next) => {
    try {
        const payload = req.body || {};
        const { taskName, summary, userId } = payload

        if (!taskName || !summary || !userId) throw new Error('Missing task information');

        const data = await createTask([taskName, summary, userId]);
        res.status(201).json({ task: data });
    } catch (error) {
        next(error);
    };
});

// PUT route to update specific task
router.put("/user/:taskId", async (req, res, next) => {
    try {
        const payload = req.body || {};
        const taskId = req.params?.taskId;

        if (Object.keys(payload).length === 0) throw new Error('No data provided for update');

        const data = await updateTask(taskId, payload);
        
        notifyManager(taskId, payload);

        res.status(200).json({ task: data });
    } catch (error) {
        next(error);
    };
});

// DELETE route for specific task
router.delete("/:taskId", async (req, res, next) => {
    try {
        const userId = req.params.taskId;
        await deleteTask(userId);
        res.sendStatus(204);
    } catch (error) {
        next(error);
    }; 
});

module.exports = router;