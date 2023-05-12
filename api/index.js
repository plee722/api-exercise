const router = require("express").Router();

// Organizes routes into central spot
router.use("/users", require("./routes/users"));
router.use("/tasks", require("./routes/tasks"));

module.exports = router;