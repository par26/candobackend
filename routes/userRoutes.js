const express = require("express");
const { authenticateAdmin } = require("../controllers/userController");
const authController = require("../controllers/authController");
const companyRouter = require("./companyRoutes");
const companyController = require("../controllers/companyController");
const reportGenerator = require("../controllers/reportController");
const userController = require("../controllers/userController");

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/validate-token", authController.protect, (req, res) => {
    res.status(200).json({
        status: "success",
        message: "Token is valid",
    });
});
router.get("/get-user-from-token", authController.protect, (req, res) => {
    res.status(200).json({
        status: "success",
        user: req.user,
    });
});
router.get(
    "/recommended-tags",
    authController.protect,
    userController.getRecommendedTags
);

router.use(
    "/:userId/companies",
    authController.protect,
    authController.checkUserIdMatch,
    companyRouter
);

router.post(
    "/:userId/generate-report",
    authController.protect,
    reportGenerator.generatePdf
);

module.exports = router;
