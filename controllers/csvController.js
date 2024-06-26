const fs = require("fs");
const path = require("path");
const companyController = require("../controllers/companyController");
const catchAsync = require("../utils/catchAsync");
const Company = require("../models/companyModel");
const { Readable } = require("stream");
const { format } = require("date-fns");
const { Parser } = require("json2csv");
const getCommonTags = require("../utils/getCommonTags");

// Utility function to capitalize the first letter of a string
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Controller to generate a CSV file from the user's companies
exports.generateCSV = catchAsync(async (req, res, next) => {
    // Fetch all companies owned by the logged-in user
    const companies = await Company.find({ owner: req.user._id });

    // Process the companies data to prepare it for CSV conversion
    const companiesArray = companies
        .map(company => company.toObject())
        .map(c => ({
            ...c,
            type: c.type.join(", "), // Join array of types into a comma-separated string
            resources: c.resources.map(r => r.link).join("\n"), // Join array of resources into a newline-separated string
        }));

    const body = req.body;

    // Get the user's first name
    const userName = req.user.firstName;

    // Get common tags from the companies
    const tags = getCommonTags(companiesArray);

    // Create a file name using the user's first and last name
    const fileName = `${capitalizeFirstLetter(
        req.user.firstName
    )}_${capitalizeFirstLetter(req.user.lastName)}`;

    // Define the fields to be included in the CSV file
    const fields = [
        { label: "Company Name", value: "name" },
        { label: "Description", value: "description" },
        { label: "Email", value: "email" },
        { label: "Phone Number", value: "phoneNumber" },
        { label: "Resources", value: "resources" },
        { label: "Tags", value: "type" },
    ];

    // Create a new JSON to CSV parser with the defined fields
    const json2csvParser = new Parser({ fields });

    // Parse the processed JSON data to CSV format
    const csv = await json2csvParser.parse(companiesArray);

    // Set response headers to indicate that the response is a CSV file
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);

    // Send the CSV data as a response
    res.status(200).send(csv);
});
