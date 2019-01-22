var express = require('express');
var router = express.Router();

/* GET dashboard signup page. */
router.get('/', function(req, res, next) {
  res.render('dashboard/signup/index', { title: 'Express' });
});

module.exports = router;
