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
    marker = req.param('imageMarker');
    if (limit === undefined) {
        limit = 9;
    }    
    if (marker === undefined || marker == '') {
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

module.exports = router;