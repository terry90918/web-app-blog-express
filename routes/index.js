const express = require('express');
const router = express.Router();
const db = require('../connections/firebase_admin');

// const ref = db.ref('any');
// ref.once('value', (snapshot) => {
//   console.log('/', snapshot.val());
// });

router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' });
});

router.get('/post', (req, res, next) => {
  res.render('post', { title: 'Express' });
});

router.get('/dashboard/signup', (req, res, next) => {
  res.render('dashboard/signup', { title: 'Express' });
});

module.exports = router;
