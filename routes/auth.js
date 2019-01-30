const express = require('express');
const router = express.Router();
const db = require('../connections/firebase_admin');
const client = require('../connections/firebase_client');

// const ref = db.ref('any');
// ref.once('value', (snapshot) => {
//   console.log('/', snapshot.val());
// });

router.get('/sign-in', (req, res, next) => {
  console.log(client.auth());
  
  res.render('auth/sign-in', {
    title: 'Sign In',
  });
});

router.get('/sign-out', (req, res, next) => {
  res.render('auth/sign-out', {
    title: 'Sign Out',
  });
});

router.get('/sign-up', (req, res, next) => {
  res.render('auth/sign-up', {
    title: 'Sign Up',
  });
});

module.exports = router;
