var express = require('express');
var router = express.Router();

/* GET dashboard article page. */
router.get('/', function(req, res, next) {
  res.render('dashboard/article/index', { title: 'Express' });
});

module.exports = router;
