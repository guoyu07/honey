var express = require('express');
var config = require('../config.js');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
	res.render('index', {domain: config.Domain , uptoken_url:'/image/uptoken'});
});

module.exports = router;
