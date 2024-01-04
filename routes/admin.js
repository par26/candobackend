var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.get('/searchCompany/', function(req, res) {
  req.query.searchString
  req.query.filters
  req.query.distance


})

module.exports = router;
