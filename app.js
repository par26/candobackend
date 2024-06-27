require("dotenv").config();
const User = require("./models/userModel");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const jwt = require("jsonwebtoken");
const userRouter = require("./routes/userRoutes");
const companyRouter = require("./routes/companyRoutes");
const errorController = require("./controllers/errorController");
const AppError = require("./utils/AppError");
const cors = require("cors");
const publicCompanyRouter = require("./routes/publicCompanyRoutes");

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

app.use("/api/v1/users", userRouter);
app.use("/api/v1/public-companies", publicCompanyRouter);
// app.use("/api/v1/companies", companyRouter);

app.all("*", (req, res, next) => {
    const error = new AppError(
        `Can't find ${req.originalUrl} on this server!`,
        404
    );

    next(error);
});

app.use(errorController);

module.exports = app;
