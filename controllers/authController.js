const mongoose = require("mongoose");
const catchAsync = require("../utils/catchAsync");
const Admin = require("../models/adminModel");

exports.signup = catchAsync(async (req, res) => {
    const admin = await Admin.create(req.body);

    res.status(201).json({
        status: "success",
        data: {
            admin,
        },
    });
});
