const express = require("express");
const { authenticateAdmin } = require("../controllers/adminController");

const router = express.Router();

router.use(authenticateAdmin);

/* GET users listing. */
router.get("/", function (req, res) {
    res.send("respond with a resource");
});

module.exports = router;
