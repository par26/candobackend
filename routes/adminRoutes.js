const express = require("express");
const { authenticateAdmin } = require("../controllers/adminController");
const authController = require("../controllers/authController");

const router = express.Router();

// router.use(authenticateAdmin);

/* GET users listing. */
router.get("/", (req, res) => {
    res.send("respond with a resource");
});

router.post("/signup", authController.signup);

module.exports = router;
