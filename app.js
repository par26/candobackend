require("dotenv").config();
const Admin = require("./models/adminModel");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const jwt = require("jsonwebtoken");
const indexRouter = require("./routes/index");
const adminRouter = require("./routes/admin");

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

async function authenticateAdmin(req, res, next) {
	try {
		const autHeader = req.headers["authorization"];
		const token = autHeader && autHeader.splice(" ")[1];

		if (token == null) {
			return req.sendStatus(401);
		}

		jwt.verify(
			token,
			process.env.ACCESS_TOKEN_SECRET,
			async (err, adminID) => {
				if (err) res.sendStatus(401);

				req.adminID = adminID;
				const admin = await Admin.findById(adminID);

				if (!admin) {
					throw new Error("Invalid token.");
				}

				req.admin = admin;

				next();
			}
		);
	} catch (err) {
		res.status(401).json({ error: err.message });
	}
}

app.use("/", indexRouter);
app.use("/admin", adminRouter, authenticateAdmin);

module.exports = app;
