const router = require("express").Router();
const { getUsers } = require("./helpers");

// GET route for all users
router.get("/", async (req, res, next) => {
    try {
        const data = await getUsers();
        res.status(200).json({ users: data });  
    } catch (error) {
        next(error);
    };
});

module.exports = router;