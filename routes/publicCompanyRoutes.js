const express = require("express");
const publicCompanyController = require("../controllers/publicCompanyController");

const router = express.Router();

router.route("/").get(publicCompanyController.getAllPublicCompanies);

router.route("/:companyId").get(publicCompanyController.getPublicCompany);

module.exports = router;
