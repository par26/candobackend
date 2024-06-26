const express = require("express");
const companyController = require("../controllers/companyController");
const authController = require("../controllers/authController");

const router = express.Router({ mergeParams: true });

// Route to get all companies and create a new company
router
    .route("/")
    .get(companyController.getAllCompanies) // Get all companies
    .post(companyController.createCompany); // Create a new company

// Route to search for companies
router.get("/search", companyController.searchCompany);

// Routes to get, update, and delete a company by ID
router
    .route("/:companyId")
    .get(authController.checkOwner, companyController.getCompany) // Get a company by ID (ownership check)
    .patch(authController.checkOwner, companyController.updateCompany) // Update a company by ID (ownership check)
    .delete(authController.checkOwner, companyController.deleteCompany); // Delete a company by ID (ownership check)

// Export the router
module.exports = router;
