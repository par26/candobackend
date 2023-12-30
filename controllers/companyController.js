const express = require("express");
const Company = require("../models/companyModel");
const APIFeatures = require("../utils/APIFeatures");

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
exports.getAllCompanies = async (req, res) => {
	try {
		const features = new APIFeatures(Company.find(), req.query)
			.filter()
			.sort()
			.limitFields()
			.paginate();

		const companies = await features.query;
		console.log("after await query");

		res.status(200).json({
			status: "success",
			results: companies.length,
			data: {
				companies,
			},
		});
	} catch (error) {
		res.status(404).json({
			status: "fail",
			message: error,
		});
	}
};

exports.getCompany = async (req, res) => {
	try {
		const { id } = req.params;
		const company = await Company.findById(id);

		res.status(200).json({
			status: "success",
			data: { company },
		});
	} catch (error) {
		res.status(404).json({
			status: "fail",
			message: error,
		});
	}
};

exports.createCompany = async (req, res) => {
	try {
		const newCompany = await Company.create(req.body);
		res.status(201).json({
			status: "success",
			data: {
				company: newCompany,
			},
		});
	} catch (error) {
		res.status(404).json({
			status: "fail",
			message: error,
		});
	}
};

exports.updateCompany = async (req, res) => {
	try {
		const { id } = req.params;
		const updatedCompany = await Company.findByIdAndUpdate(id, req.body, {
			new: true,
			runValidators: true,
		});
		res.status(200).json({
			status: "success",
			data: { company: updatedCompany },
		});
	} catch (error) {
		res.status(404).json({
			status: "fail",
			message: error,
		});
	}
};

exports.deleteCompany = async (req, res) => {
	try {
		const { id } = req.params;
		await Company.findByIdAndDelete(id);
		res.status(204).json({ status: "success", data: null });
	} catch (error) {
		res.status(404).json({
			status: "fail",
			message: error,
		});
	}
};

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
// 		// Find the admin document by ID and append the new company id to the companies array
// 		Admin.findByIdAndUpdate(
// 			req.admin._id,
// 			{ $push: { companies: company._id } },
// 			{ new: true }
// 		).exec((err, admin) => {
// 			if (err) {
// 				return res.status(500).send(err);
// 			}
// 		});
// 	});
// };
