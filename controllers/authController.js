const mongoose = require("mongoose");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");
const bcrypt = require("bcryptjs");
const { promisify } = require("util");
const Company = require("../models/companyModel");

function signToken(id) {
    return jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
}

exports.signup = catchAsync(async (req, res) => {
    const { firstName, lastName, email, phoneNumber, password } = req.body;

    const user = await User.create({
        firstName,
        lastName,
        email,
        phoneNumber,
        password,
    });

    const token = signToken(user._id);

    res.status(201).json({
        status: "success",
        token,
        data: {
            user,
        },
    });
});

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new AppError("Please provide email and password", 400));
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePasswords(password, user.password))) {
        return next(new AppError("Email or password incorrect", 401));
    }

    const token = signToken(user._id);
    res.status(200).json({
        status: "success",
        token,
    });
});

exports.protect = catchAsync(async (req, res, next) => {
    let token;

    if (!req.headers.authorization) {
        return next(
            new AppError("Please log in to get access to this resource", 400)
        );
    } else {
        // Split the string by space to extract the token since req.headers.authorization is going to be a string like
        // Bearer ...token_here
        token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
        return next(new AppError("Invalid format for token", 400));
    }

    const payload = await promisify(jwt.verify)(
        token,
        process.env.ACCESS_TOKEN_SECRET
    );
    if (!payload.id) {
        return next(new AppError("id doesn't exist on payload", 401));
    }

    const foundUser = await User.findById(payload.id);
    if (!foundUser) {
        return next(
            new AppError("The user issued in the token doesn't exist", 401)
        );
    }

    const hasPasswordChanged = foundUser.hasPasswordChangedAfter(payload.iat);
    if (hasPasswordChanged) {
        return next(
            new AppError(
                "The user changed their password after the token was issued. Please log in again",
                401
            )
        );
    }

    req.user = foundUser;

    next();
});

exports.checkUserIdMatch = async (req, res, next) => {
    const user = await User.findById(req.params.userId);

    if (!user) {
        return next(new AppError("Requested user doesn't exist", 401));
    }

    if (!user._id.equals(req.user._id)) {
        return next(
            new AppError(
                "You are not allowed to create a company for this user",
                401
            )
        );
    }

    next();
};

exports.checkOwner = async (req, res, next) => {
    const company = await Company.findById(req.params.companyId);
    if (!company.owner.equals(req.user._id)) {
        return next(new AppError("You do not own this company", 401));
    }

    next();
};
