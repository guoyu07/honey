var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.send("image service");
});

router.get('/upload', function(req, res) {
  res.send("image service - upload");
});

router.get('/uptoken', function(req, res) {
  res.send("image service - uptoken");
});

router.get('/list', function(req, res) {
  res.send("image service - list");
});

module.exports = router;
