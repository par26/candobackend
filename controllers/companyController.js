const express = require("express");
const Company = require("../models/companyModel");
const APIFeatures = require("../utils/APIFeatures");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const User = require("../models/userModel");

/**
 * Get all companies owned by the logged-in user with optional query parameters
 * for filtering, sorting, field limiting, and pagination
 * @param {express.Request} req
 * @param {express.Response} res
 */
exports.getAllCompanies = catchAsync(async (req, res) => {
    // Initialize APIFeatures with Company query and request query parameters
    const features = new APIFeatures(
        Company.find({ owner: req.user._id }),
        req.query
    )
        .filter()
        .sort()
        .limitFields()
        .paginate();

    // Execute the query and get companies
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
 * Get a single company by ID and increment its click count and update last clicked time
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {Function} next
 */
exports.getCompany = catchAsync(async (req, res, next) => {
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

/**
 * Create a new company with the logged-in user as the owner
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {Function} next
 */
exports.createCompany = catchAsync(async (req, res, next) => {
    // Create new company with request body data and owner ID
    const newCompany = await Company.create({
        ...req.body,
        owner: req.user._id,
        createdAt: Date.now(),
    });

    // Send response with created company data
    res.status(201).json({
        status: "success",
        data: {
            company: newCompany,
        },
    });
});

/**
 * Update an existing company by ID
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {Function} next
 */
exports.updateCompany = catchAsync(async (req, res, next) => {
    const { companyId } = req.params;

    // Find company by ID and update with request body data
    const updatedCompany = await Company.findByIdAndUpdate(
        companyId,
        req.body,
        {
            new: true,
            runValidators: true,
        }
    );

    // If company not found, return error
    if (!updatedCompany) {
        return next(new AppError("No company found with that id", 404));
    }

    // Send response with updated company data
    res.status(200).json({
        status: "success",
        data: { company: updatedCompany },
    });
});

/**
 * Delete a company by ID
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {Function} next
 */
exports.deleteCompany = catchAsync(async (req, res, next) => {
    const { companyId } = req.params;

    // Find company by ID and delete
    const deletedCompany = await Company.findByIdAndDelete(companyId);

    // If company not found, return error
    if (!deletedCompany) {
        return next(new AppError("No company found with that id", 404));
    }

    // Send response with no content
    res.status(204).json({ status: "success", data: null });
});

/**
 * Search for companies by keyword in name or type, owned by the logged-in user
 * @param {express.Request} req
 * @param {express.Response} res
 */
exports.searchCompany = catchAsync(async (req, res) => {
    const { keyword } = req.query;

    // Build filter criteria for search
    const filterCriteria = {
        $or: [
            {
                name: {
                    $regex: keyword,
                    $options: "i", // Case insensitive
                },
            },
            {
                type: {
                    $regex: keyword,
                    $options: "i", // Case insensitive
                },
            },
        ],
        owner: req.user._id,
    };

    // Find companies matching filter criteria
    const companies = await Company.find(filterCriteria);

    // Send response with found companies data
    res.status(200).json({
        status: "success",
        data: companies,
    });
});
