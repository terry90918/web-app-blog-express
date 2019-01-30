const express = require('express');
const router = express.Router();
const db = require('../connections/firebase_admin');
const firebase = require('../connections/firebase_client');

// const ref = db.ref('any');
// ref.once('value', (snapshot) => {
//   console.log('/', snapshot.val());
// });

router.get('/sign-in', (req, res, next) => {
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

router.get('/sign-up', (req, res, next) => {
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      if (errorCode == 'auth/weak-password') {
        console.log('The password is too weak.');
      } else {
        console.log(errorMessage);
      }
      console.log(error);
    });

  res.render('auth/sign-up', {
    title: 'Sign Up',
  });
});

module.exports = router;
