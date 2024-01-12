const express = require("express");
const companyController = require("../controllers/companyController");
const authController = require("../controllers/authController");

const router = express.Router({ mergeParams: true });

router
    .route("/")
    // .get(companyController.getAllCompanies)
    .post(authController.protect, companyController.createCompany);

router
    .route("/:id")
    .get(authController.protect, companyController.getCompany)
    .patch(authController.protect, companyController.updateCompany)
    .delete(authController.protect, companyController.deleteCompany);

module.exports = router;
