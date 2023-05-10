const router = require("express").Router();

// Organizes routes into central spot
router.use("/users", require("./routes/users"));

module.exports = router;