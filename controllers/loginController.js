// import { json } from "express";
// import { Admin } from "../models/adminModel";
// import { Jwt } from "jsonwebtoken";

const { json } = require("express");
const Admin = require("../models/adminModel");
const { Jwt } = require("jsonwebtoken");

let refreshTokens = [];

exports.token = (req, res, next) => {
	const refreshToken = req.body.token;
	if (refreshToken == null) return res.status(401);
	if (!refreshTokens.includes(refreshToken)) return res.status(403);

	Jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, admin) => {
		if (err) return res.status(403);

		const accessToken = generateAccessToken(admin._id);

		res.json({ accessToken: accessToken });
	});
};

exports.login_post = (req, res, next) => {
	var admin = Admin.findOne({ email: req.body.email }).exec((err, admin) => {
		//checks if the admin exists
		if (err || admin == null) {
			return res.status(400).send("Invalid Information");
		} else {
			const access_token = Jwt.sign(
				admin._id,
				process.env.ACCESS_TOKEN_SECRET
			);
			const refresh_token = Jwt.sign(
				admin._id,
				process.env.REFRESH_TOKEN_SECRET
			);
			//redirct the user to the admin's url
			res.json({ access_token: access_token });
		}
	});
};

function generateAccessToken(AdminID) {
	return Jwt.sign(AdminID, process.env.ACCESS_TOKEN_SECRET, {
		expiresIn: "10m",
	});
}
