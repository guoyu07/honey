var express = require('express');
var config = require('../config.js');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
	req.session['image-marker'] = null;//重置图片索引标记
	res.render('index', {domain: config.Domain , uptoken_url:'/image/uptoken'});
});

module.exports = router;
