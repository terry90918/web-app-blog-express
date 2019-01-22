var express = require('express');
var router = express.Router();

/* GET dashboard archives page. */
router.get('/', function(req, res, next) {
  res.render('dashboard/archives/index', { title: 'Express' });
});

module.exports = router;
