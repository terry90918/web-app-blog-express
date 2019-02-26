const express = require('express');
const router = express.Router();
const db = require('../connections/firebase_admin');
const firebase = require('../connections/firebase_client');

// const ref = db.ref('any');
// ref.once('value', (snapshot) => {
//   console.log('/', snapshot.val());
// });

/* 路由 - 登入頁 */
router.get('/sign-in', (req, res) => {
  res.render('auth/sign-in', {
    title: 'Sign In',
  });
});

/* 寫入 - 會員登入 */
router.post('/sign-in', (req, res) => {
  const data = req.body;
  const email = data.email;
  const password = data.password;
  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then((response) => {
      const uid = response.user.uid;
      req.session.uid = uid;
      res.render('auth/sign-in-success');
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      if (errorCode === 'auth/wrong-password') {
        req.flash('info', 'Wrong password.');
      } else {
        req.flash('info', `errorMessage: ${errorMessage}`, `error: ${error}`);
      }
      res.redirect('/auth/sign-in');
    });
});

/* 路由 - 會員登出頁 */
router.get('/sign-out', (req, res) => {
  req.session.uid = '';
  res.render('auth/sign-out', {
    title: 'Sign Out',
  });
});

/* 路由 - 會員註冊頁 */
router.get('/sign-up', (req, res) => {
  const message = req.flash('info');
  res.render('auth/sign-up', {
    hasInfo: message.length > 0,
    message,
    title: 'Sign Up',
  });
});

/* 寫入 - 會員註冊資料 */
router.post('/sign-up', (req, res) => {
  const data = req.body;
  const accountName = data.accountName;
  const email = data.email;
  const password = data.password;
  const nickname = data.nickname;
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then((response) => {
      const uid = response.user.uid;
      const userRef = db.ref(`/blog/users/${accountName}`);
      const userData = {
        accountName,
        email,
        nickname,
        uid,
      };
      userRef
        .set(userData)
        .then(() => {
          res.render('auth/sign-up-success');
        });
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      if (errorCode == 'auth/weak-password') {
        req.flash('info', 'The password is too weak.');
      } else {
        req.flash('info', `errorMessage: ${errorMessage}`, `error: ${error}`);
      }
      res.redirect('/auth/sign-up');
    });
});

/* 取的 - 登入狀態 */
// 檢查用戶是否仍持續登入
router.get('/sign-check', (req, res) => {
  if (req.session.uid) {
    res.send({
      success: true,
      message: '已登入帳號',
      content: {}
    });
  } else {
    res.send({
      success: false,
      message: '未登入帳號',
      content: {}
    });
  }
});

module.exports = router;
