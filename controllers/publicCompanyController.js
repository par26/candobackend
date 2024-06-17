const express = require("express");
const catchAsync = require("../utils/catchAsync");
const APIFeatures = require("../utils/APIFeatures");
const Company = require("../models/companyModel");

exports.getAllPublicCompanies = catchAsync(async (req, res) => {
    const features = new APIFeatures(Company.find({ public: true }), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();

    const companies = await features.query;

    res.status(200).json({
        status: "success",
        results: companies.length,
        data: {
            companies,
        },
    });
});

exports.getPublicCompany = catchAsync(async (req, res) => {
    const { companyId } = req.params;
    const company = await Company.findByIdAndUpdate(
        companyId,
        { $inc: { amountClicked: 1 }, lastClickedAt: Date.now() },
        {
            new: true,
        }
    );

    if (!company) {
        return next(new AppError("No company found with that id", 404));
    }

    res.status(200).json({
        status: "success",
        data: { company },
    });
});
