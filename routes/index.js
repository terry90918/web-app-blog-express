const express = require('express');
const router = express.Router();
const db = require('../connections/firebase_admin');
const striptags = require('striptags');
const moment = require('moment');
const convertPagination = require('../modules/convertPagination');

const categoriesRef = db.ref('/blog/categories/');
const articlesRef = db.ref('/blog/articles/');

// const ref = db.ref('any');
// ref.once('value', (snapshot) => {
//   console.log('/', snapshot.val());
// });

/* 取得文章列表 */
router.get('/', (req, res, next) => {
  let articles = [];
  let categories = {};
  let currentPage = Number.parseInt(req.query.page) || 1; // 當前頁數
  let data = [];
  let page = {};
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
      articles.reverse();
      return Promise.resolve('Success');
    })
    .then(() => {
      /* 分頁處理 - Start */
      const val = convertPagination(articles, currentPage);
      data = val.data;
      page = val.page;
      return Promise.resolve('Success');
      /* 分頁處理 - End */
    })
    .then(() => {
      res.render('index', {
        articles: data,
        categories,
        moment,
        page,
        striptags,
        title: 'Express',
      });
    })
    .catch((error) => {
      console.warn(error);
    });
});

/* 取得文章內容 */
router.get('/post/:id', (req, res, next) => {
  const id = req.params.id;
  let categories = {};
  let article = {};
  categoriesRef
    .once('value')
    .then((snapshot) => {
      categories = snapshot.val();
      return articlesRef
        .child(id)
        .once('value');
    })
    .then((snapshot) => {
      article = snapshot.val();
      res.render('post', {
        article,
        categories,
        moment,
        striptags, 
        title: 'Post: ' + id
      });
    });
});

router.get('/dashboard/signup', (req, res, next) => {
  res.render('dashboard/signup', { title: 'Express' });
});

module.exports = router;
