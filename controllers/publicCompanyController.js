const express = require("express");
const catchAsync = require("../utils/catchAsync");
const APIFeatures = require("../utils/APIFeatures");
const Company = require("../models/companyModel");

/**
 * Get all public companies with optional query parameters for filtering,
 * sorting, field limiting, and pagination
 * @param {express.Request} req
 * @param {express.Response} res
 */
exports.getAllPublicCompanies = catchAsync(async (req, res) => {
    // Initialize APIFeatures with Company query for public companies and request query parameters
    const features = new APIFeatures(Company.find({ public: true }), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();

    // Execute the query and get public companies
    const companies = await features.query;

    // Send response with companies data
    res.status(200).json({
        status: "success",
        results: companies.length,
        data: {
            companies,
        },
    });
});

/**
 * Get a single public company by ID and increment its click count and update last clicked time
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {Function} next
 */
exports.getPublicCompany = catchAsync(async (req, res, next) => {
    const { companyId } = req.params;

    // Find company by ID and update click count and last clicked time
    const company = await Company.findByIdAndUpdate(
        companyId,
        { $inc: { amountClicked: 1 }, lastClickedAt: Date.now() },
        {
            new: true,
        }
    );

    // If company not found, return error
    if (!company) {
        return next(new AppError("No company found with that id", 404));
    }

    // Send response with company data
    res.status(200).json({
        status: "success",
        data: { company },
    });
});
