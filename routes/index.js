const express = require("express");

const router = express.Router();

const loginController = require("../controllers/loginController.js");

let refreshTokens = [];

/* GET home page. */
router.get("/", function (req, res) {
    //res.render('index', { title: 'Express' });
});

//route to refresh the token
router.get("/token", loginController.token);

module.exports = router;
