const Admin = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const getCommonTags = require("../utils/getCommonTags");
const Company = require("../models/companyModel");
const jwt = require("jsonwebtoken");

/**
 * Middleware to authenticate an admin using a JWT token
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {Function} next
 */
exports.authenticateAdmin = (req, res, next) => {
    try {
        const autHeader = req.headers["authorization"];
        // Extract token from the authorization header
        const token = autHeader && autHeader.split(" ")[1];

        // If no token is provided, return 401 status
        if (token == null) {
            return req.sendStatus(401);
        }

        // Verify the token
        jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET,
            async (err, adminID) => {
                if (err) res.sendStatus(401);

                // Attach the admin ID to the request object
                req.adminID = adminID;
                // Find the admin by ID
                const admin = await Admin.findById(adminID);

                // If admin not found, throw an error
                if (!admin) {
                    throw new Error("Invalid token.");
                }

                // Attach the admin to the request object
                req.admin = admin;

                // Proceed to the next middleware or route handler
                next();
            }
        );
    } catch (err) {
        // Return 401 status and error message in case of an error
        res.status(401).json({ error: err.message });
    }
};

/**
 * Handler to get recommended tags based on the companies owned by the user
 * @param {express.Request} req
 * @param {express.Response} res
 */
exports.getRecommendedTags = catchAsync(async (req, res) => {
    const TAG_LIMITS = 7;

    // Find all companies owned by the logged-in user
    const companies = await Company.find({ owner: req.user._id });
    // Get common tags from the companies, limited to TAG_LIMITS
    const tags = getCommonTags(companies, TAG_LIMITS);

    // Send response with the recommended tags
    res.status(200).json({
        status: "success",
        results: TAG_LIMITS,
        data: {
            tags: Array.from(tags.keys()),
        },
    });
});

/**
 * Handler for admin creation
 * @param {express.Request} req
 * @param {express.Response} res
 */
exports.admin_create_post = async (req, res) => {
    // Create a new Admin instance with the request body data
    var adminModel = new Admin({
        email: req.body.email,
        password: req.body.password,
        first_name: req.body.firstName,
        last_name: req.body.lastName,
        phone_number: req.body.phone_number,
    });

    try {
        // Save the admin instance to the database
        await adminModel.save();

        // Generate an access token for the admin
        const access_token = jwt.sign(
            adminModel._id,
            process.env.ACCESS_TOKEN_SECRET
        );

        // Send response with the access token
        res.json({ access_token: access_token });
        console.log("Request handled successfully");
    } catch (err) {
        // Return 400 status and error message in case of an error
        res.status(400).send("Error saving admin");
    }
};
