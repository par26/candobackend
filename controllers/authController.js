const mongoose = require("mongoose");
const catchAsync = require("../utils/catchAsync");
const Admin = require("../models/adminModel");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");
const bcrypt = require("bcryptjs");

function signToken(id) {
    return jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
}

exports.signup = catchAsync(async (req, res) => {
    const { firstName, lastName, email, phoneNumber, password } = req.body;

    const admin = await Admin.create({
        firstName,
        lastName,
        email,
        phoneNumber,
        password,
    });

    const token = signToken(admin._id);

    res.status(201).json({
        status: "success",
        token,
        data: {
            admin,
        },
    });
});

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new AppError("Please provide email and password", 400));
    }

    const user = await Admin.findOne({ email }).select("+password");
    if (!user || !(await user.comparePasswords(password, user.password))) {
        return next(new AppError("Email or password incorrect", 401));
    }

    const token = signToken(user._id);
    res.status(200).json({
        status: "success",
        token,
    });
});
