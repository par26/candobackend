const express = require("express");
const { authenticateAdmin } = require("../controllers/userController");
const authController = require("../controllers/authController");
const companyRouter = require("./companyRoutes");
const companyController = require("../controllers/companyController");

const router = express.Router();

// router.use(authenticateAdmin);

/* GET users listing. */
router.get("/", (req, res) => {
    res.send("respond with a resource");
});

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post(
    "/validate-token",
    authController.protect,
    authController.validateToken
);

router.use(
    "/:userId/companies",
    authController.protect,
    authController.checkUserIdMatch,
    companyRouter
);

module.exports = router;
