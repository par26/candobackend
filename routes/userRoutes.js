const express = require("express");
const { authenticateAdmin } = require("../controllers/userController");
const authController = require("../controllers/authController");
const companyRouter = require("./companyRoutes");
const companyController = require("../controllers/companyController");
const reportController = require("../controllers/reportController");
const userController = require("../controllers/userController");
const csvController = require("../controllers/csvController");

const router = express.Router();

// Route for user signup
router.post("/signup", authController.signup);

// Route for user login
router.post("/login", authController.login);

// Route to validate a token and check its validity
router.post("/validate-token", authController.protect, (req, res) => {
    res.status(200).json({
        status: "success",
        message: "Token is valid",
    });
});

// Route to get user information from a token
router.get("/get-user-from-token", authController.protect, (req, res) => {
    res.status(200).json({
        status: "success",
        user: req.user,
    });
});

// Route to get recommended tags for the logged-in user
router.get(
    "/recommended-tags",
    authController.protect,
    userController.getRecommendedTags
);

// Nested routes for companies associated with a user, protected and checked for user ID match
router.use(
    "/:userId/companies",
    authController.protect,
    authController.checkUserIdMatch,
    companyRouter
);

// Route to generate a PDF report for a user, protected
router.post(
    "/:userId/generate-report",
    authController.protect,
    reportController.generatePdf
);

// Route to generate a CSV report for a user, protected
router.post(
    "/:userId/generate-csv",
    authController.protect,
    csvController.generateCSV
);

// Export the router
module.exports = router;
