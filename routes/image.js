var express = require('express');
var config = require('../config.js');
var qiniu = require('qiniu');

var router = express.Router();
qiniu.conf.ACCESS_KEY = config.ACCESS_KEY;
qiniu.conf.SECRET_KEY = config.SECRET_KEY;
var uptoken = new qiniu.rs.PutPolicy(config.Bucket_Name);

/* GET home page. */
router.get('/', function(req, res) {
  res.send("image service");
});

router.get('/upload', function(req, res) {
  res.send("image service - upload");
});

router.get('/uptoken', function(req, res, next) {
    var token = uptoken.token();
    res.header("Cache-Control", "max-age=0, private, must-revalidate");
    res.header("Pragma", "no-cache");
    res.header("Expires", 0);
    if (token) {
        res.json({
            uptoken: token
        });
    }
});

router.get('/list', function(req, res) {
  res.send("image service - list");
});

module.exports = router;
