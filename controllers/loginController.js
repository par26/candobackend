const { json } = require("express");
const User = require("../models/userModel");
const { Jwt } = require("jsonwebtoken");

// In-memory storage for refresh tokens
let refreshTokens = [];

/**
 * Handler to generate a new access token using a refresh token
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {Function} next
 */
exports.token = (req, res, next) => {
    const refreshToken = req.body.token;

    // Check if the refresh token is provided
    if (refreshToken == null) return res.status(401).send("No token provided");

    // Check if the refresh token is valid
    if (!refreshTokens.includes(refreshToken))
        return res.status(403).send("Invalid token");

    // Verify the refresh token
    Jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).send("Token verification failed");

        // Generate a new access token
        const accessToken = generateAccessToken(user._id);

        // Send the new access token
        res.json({ accessToken: accessToken });
    });
};

/**
 * Handler for user login
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {Function} next
 */
exports.login_post = (req, res, next) => {
    // Find user by email
    const user = User.findOne({ email: req.body.email }).exec((err, user) => {
        // Check if the user exists
        if (err || user == null) {
            return res.status(400).send("Invalid Information");
        } else {
            // Generate access and refresh tokens
            const access_token = Jwt.sign(
                user._id,
                process.env.ACCESS_TOKEN_SECRET
            );
            const refresh_token = Jwt.sign(
                user._id,
                process.env.REFRESH_TOKEN_SECRET
            );

            // Store the refresh token
            refreshTokens.push(refresh_token);

            // Send the access token as a response
            res.json({
                access_token: access_token,
                refresh_token: refresh_token,
            });
        }
    });
};

/**
 * Function to generate a new access token
 * @param {string} userId
 * @returns {string} Access token
 */
function generateAccessToken(userId) {
    return Jwt.sign(userId, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "10m",
    });
}
