const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' });
});

router.get('/post', (req, res, next) => {
  res.render('post', { title: 'Express' });
});

router.get('/dashboard/archives', (req, res, next) => {
  res.render('dashboard/archives', { title: 'Express' });
});

router.get('/dashboard/article', (req, res, next) => {
  res.render('dashboard/article', { title: 'Express' });
});

router.get('/dashboard/categories', (req, res, next) => {
  res.render('dashboard/categories', { title: 'Express' });
});

router.get('/dashboard/signup', (req, res, next) => {
  res.render('dashboard/signup', { title: 'Express' });
});

module.exports = router;
