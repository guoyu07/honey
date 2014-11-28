var express = require('express');
var config = require('../config.js');
var qiniu = require('qiniu');

var router = express.Router();
qiniu.conf.ACCESS_KEY = config.ACCESS_KEY;
qiniu.conf.SECRET_KEY = config.SECRET_KEY;
var uptoken = new qiniu.rs.PutPolicy(config.Bucket_Name);

/* 加载图片 */
router.get('/load', function(req, res) {
    limit = req.param('limit');
    if (limit === undefined) {
        limit = 5;
    }
    var marker = req.session['image-marker'];
    if (marker === undefined) {
        marker = null;
    }
    
    qiniu.rsf.listPrefix(config.Bucket_Name, null, marker, limit, function(err, ret) {
        if (!err) {
            req.session['image-marker'] = ret.marker;
            res.json(ret);
        } else {            
            console.log(err);
            res.json(err);
        }
    });
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