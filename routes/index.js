const express = require('express');
const router = express.Router();
const db = require('../connections/firebase_admin');
const striptags = require('striptags');
const moment = require('moment');

const categoriesRef = db.ref('/blog/categories/');
const articlesRef = db.ref('/blog/articles/');

// const ref = db.ref('any');
// ref.once('value', (snapshot) => {
//   console.log('/', snapshot.val());
// });

/* 取得文章列表 */
router.get('/', (req, res, next) => {
  let categories = {};
  let articles = [];
  categoriesRef
    .once('value')
    .then((snapshot) => {
      categories = snapshot.val();
      return articlesRef
        .orderByChild('update_time')
        .once('value');
    })
    .then((snapshot) => {
      snapshot.forEach((snapshotChild) => {
        const child = snapshotChild.val();
        if ('public' === child.status) {
          articles.push(child);
        }
      });
      return Promise.resolve(articles.reverse());
    })
    .then(() => {
      res.render('index', {
        articles,
        categories,
        moment,
        striptags,
        title: 'Express',
      });
    });
});

router.get('/post', (req, res, next) => {
  res.render('post', { title: 'Express' });
});

router.get('/dashboard/signup', (req, res, next) => {
  res.render('dashboard/signup', { title: 'Express' });
});

module.exports = router;
