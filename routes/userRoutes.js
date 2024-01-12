const express = require("express");
const { authenticateAdmin } = require("../controllers/userController");
const authController = require("../controllers/authController");
const companyRouter = require("./companyRoutes");

const router = express.Router();

// router.use(authenticateAdmin);

/* GET users listing. */
router.get("/", (req, res) => {
    res.send("respond with a resource");
});

router.post("/signup", authController.signup);
router.post("/login", authController.login);

router.use("/:userId/companies", companyRouter);

module.exports = router;
