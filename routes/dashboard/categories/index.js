var express = require('express');
var router = express.Router();

/* GET dashboard categories page. */
router.get('/', function(req, res, next) {
  res.render('dashboard/categories/index', { title: 'Express' });
});

module.exports = router;
