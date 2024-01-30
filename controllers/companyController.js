const express = require("express");
const Company = require("../models/companyModel");
const APIFeatures = require("../utils/APIFeatures");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const User = require("../models/userModel");

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
exports.getAllCompanies = catchAsync(async (req, res) => {
    const features = new APIFeatures(
        Company.find({ owner: req.user._id }),
        req.query
    )
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

exports.getCompany = catchAsync(async (req, res, next) => {
    const { companyId } = req.params;
    const company = await Company.findById(companyId);

    if (!company) {
        return next(new AppError("No company found with that id", 404));
    }

    res.status(200).json({
        status: "success",
        data: { company },
    });
});

exports.createCompany = catchAsync(async (req, res, next) => {
    const newCompany = await Company.create({
        ...req.body,
        owner: req.user._id,
        createdAt: Date.now(),
    });

    res.status(201).json({
        status: "success",
        data: {
            company: newCompany,
        },
    });
});

exports.updateCompany = catchAsync(async (req, res) => {
    const { companyId } = req.params;
    const updatedCompany = await Company.findByIdAndUpdate(
        companyId,
        req.body,
        {
            new: true,
            runValidators: true,
        }
    );

    if (!updatedCompany) {
        return next(new AppError("No company found with that id", 404));
    }

    res.status(200).json({
        status: "success",
        data: { company: updatedCompany },
    });
});

exports.deleteCompany = catchAsync(async (req, res) => {
    const { companyId } = req.params;
    const deletedCompany = await Company.findByIdAndDelete(companyId);

    if (!deletedCompany) {
        return next(new AppError("No company found with that id", 404));
    }

    res.status(204).json({ status: "success", data: null });
});

exports.searchCompany = catchAsync(async (req, res) => {
    const keyword = req.query.keyword;

    const filterCriteria = {
        $text: {
            $search: keyword,
            $caseSensitive: false,
        },

        type: req.query.type,
    };

    const companies = await Company.find(filterCriteria);

    res.send(200).json({
        status: "success",
        data: companies,
    });
});

// exports.company_create_post = async (req, res) => {
// 	var tags = req.body.tags;

// 	// Converts the tags into an array
// 	if (!Array.isArray(tags)) {
// 		if (typeof tags === "undefined") {
// 			tags = [];
// 		} else {
// 			tags = [req.body.tags];
// 		}
// 	}

// 	//note: May need to add the resources later

// 	var companyModel = new Company({
// 		name: req.body.name,

// 		type: tags,

// 		location: req.body.location,

// 		phone_number: req.body.phone_number,

// 		email: req.body.email,
// 	});

// 	companyModel.save((err, company) => {
// 		if (err) {
// 			return res.status(500).send(err);
// 		}
// 		// Successful
// 		// Find the user document by ID and append the new company id to the companies array
// 		User.findByIdAndUpdate(
// 			req.user._id,
// 			{ $push: { companies: company._id } },
// 			{ new: true }
// 		).exec((err, user) => {
// 			if (err) {
// 				return res.status(500).send(err);
// 			}
// 		});
// 	});
// };
