require("dotenv").config();
const Admin = require("./models/adminModel");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const jwt = require("jsonwebtoken");
const indexRouter = require("./routes/index");
const adminRouter = require("./routes/admin");
const companyRouter = require("./routes/companyRoutes");

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/v1/", indexRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/companies", companyRouter);

module.exports = app;
