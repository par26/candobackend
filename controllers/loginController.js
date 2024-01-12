const { json } = require("express");
const User = require("../models/userModel");
const { Jwt } = require("jsonwebtoken");

let refreshTokens = [];

exports.token = (req, res, next) => {
    const refreshToken = req.body.token;
    if (refreshToken == null) return res.status(401);
    if (!refreshTokens.includes(refreshToken)) return res.status(403);

    Jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403);

        const accessToken = generateAccessToken(user._id);

        res.json({ accessToken: accessToken });
    });
};

exports.login_post = (req, res, next) => {
    const user = User.findOne({ email: req.body.email }).exec((err, user) => {
        //checks if the user exists
        if (err || user == null) {
            return res.status(400).send("Invalid Information");
        } else {
            const access_token = Jwt.sign(
                user._id,
                process.env.ACCESS_TOKEN_SECRET
            );
            const refresh_token = Jwt.sign(
                user._id,
                process.env.REFRESH_TOKEN_SECRET
            );
            //redirct the user to the user's url
            res.json({ access_token: access_token });
        }
    });
};

function generateAccessToken(userId) {
    return Jwt.sign(userId, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "10m",
    });
}
