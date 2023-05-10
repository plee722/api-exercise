const router = require("express").Router();

// const router = express.Router();

router.get("/", (req, res, next) => {
    console.log('HITTING ROUTE');
    res.status(200).json({ test: 'test return' });    
})

// export default router;
module.exports = router;