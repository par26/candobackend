const express = require("express");
const publicCompanyController = require("../controllers/publicCompanyController");

const router = express.Router();

// Route to get all public companies
router.route("/").get(publicCompanyController.getAllPublicCompanies);

// Route to get a specific public company by ID
router.route("/:companyId").get(publicCompanyController.getPublicCompany);

// Export the router
module.exports = router;
