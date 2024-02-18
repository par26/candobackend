const express = require("express");
const companyController = require("../controllers/companyController");
const authController = require("../controllers/authController");

const router = express.Router({ mergeParams: true });

router
    .route("/")
    .get(companyController.getAllCompanies)
    .post(companyController.createCompany);

router.get("/search", companyController.searchCompany);

router
    .route("/:companyId")
    .get(authController.checkOwner, companyController.getCompany)
    .patch(authController.checkOwner, companyController.updateCompany)
    .delete(authController.checkOwner, companyController.deleteCompany);

module.exports = router;
