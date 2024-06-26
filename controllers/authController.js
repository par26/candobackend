const mongoose = require("mongoose");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");
const bcrypt = require("bcryptjs");
const { promisify } = require("util");
const Company = require("../models/companyModel");

// Function to sign a JWT token with a given user ID
function signToken(id) {
    return jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
}

// Signup handler
exports.signup = catchAsync(async (req, res) => {
    const { firstName, lastName, email, phoneNumber, password } = req.body;

    // Create a new user
    const user = await User.create({
        firstName,
        lastName,
        email,
        phoneNumber,
        password,
    });

    // Generate a JWT token
    const token = signToken(user._id);

    // Send response with token and user data
    res.status(201).json({
        status: "success",
        token,
        data: {
            user,
        },
    });
});

// Login handler
exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
        return next(new AppError("Please provide email and password", 400));
    }

    // Find user by email and select password field
    const user = await User.findOne({ email }).select("+password");

    // Check if user exists and if password is correct
    if (!user || !(await user.comparePasswords(password, user.password))) {
        return next(new AppError("Email or password incorrect", 401));
    }

    // Generate a JWT token
    const token = signToken(user._id);

    // Send response with token
    res.status(200).json({
        status: "success",
        token,
    });
});

// Middleware to protect routes
exports.protect = catchAsync(async (req, res, next) => {
    let token;

    // Check for authorization header
    if (!req.headers.authorization) {
        return next(
            new AppError("Please log in to get access to this resource", 400)
        );
    } else {
        // Extract token from authorization header
        token = req.headers.authorization.split(" ")[1];
    }

    // Check if token exists
    if (!token) {
        return next(new AppError("Invalid format for token", 400));
    }

    // Verify the token
    const payload = await promisify(jwt.verify)(
        token,
        process.env.ACCESS_TOKEN_SECRET
    );

    // Check if payload contains user ID
    if (!payload.id) {
        return next(new AppError("id doesn't exist on payload", 401));
    }

    // Find user by ID
    const foundUser = await User.findById(payload.id);
    if (!foundUser) {
        return next(
            new AppError("The user issued in the token doesn't exist", 401)
        );
    }

    // Check if the user has changed their password after the token was issued
    const hasPasswordChanged = foundUser.hasPasswordChangedAfter(payload.iat);
    if (hasPasswordChanged) {
        return next(
            new AppError(
                "The user changed their password after the token was issued. Please log in again",
                401
            )
        );
    }

    // Attach user to request object
    req.user = foundUser;

    next();
});

// Middleware to check if the user ID in the request matches the logged-in user's ID
exports.checkUserIdMatch = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.params.userId);

    // Check if user exists
    if (!user) {
        return next(new AppError("Requested user doesn't exist", 401));
    }

    // Check if user IDs match
    if (!user._id.equals(req.user._id)) {
        return next(
            new AppError(
                "You are not allowed to create a company for this user",
                401
            )
        );
    }

    next();
});

// Middleware to check if the logged-in user owns the company
exports.checkOwner = catchAsync(async (req, res, next) => {
    const company = await Company.findById(req.params.companyId);

    // Check if company owner ID matches logged-in user ID
    if (!company.owner.equals(req.user._id)) {
        return next(new AppError("You do not own this company", 401));
    }

    next();
});
