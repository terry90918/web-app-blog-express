const express = require('express');
const router = express.Router();

/* 插件 */
const striptags = require('striptags');
const moment = require('moment');

/* 模組 */
const convertPagination = require('../modules/convertPagination');

/* 資料庫 */
const db = require('../connections/firebase_admin');
const categoriesRef = db.ref('/blog/categories/');
const articlesRef = db.ref('/blog/articles/');
const usersRef = db.ref(`/blog/users`);

/* 取得 - 文章列表 */
router.get('/', (req, res) => {
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

/* 取得 - 文章內容 */
router.get('/article/:id', (req, res) => {
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
      if (!article) {
        return res.render('error', {
          title: '您尋找的文章不存在'
        })
      }
      res.render('article/_id', {
        article,
        categories,
        moment,
        striptags, 
        title: 'Post: ' + id
      });
    });
});

/* 會員資訊 */
router.get('/user/:accountName/info', (req, res) => {
  const accountName = req.params.accountName;
  const userRef = usersRef.child(accountName);

  userRef
    .once('value')
    .then((snapshot) => {
      const user = snapshot.val();
      res.render('user/info', {
        accountName,
        email: user.email,
        nickname: user.nickname,
        title: 'User Info',
      });
    });
});

module.exports = router;
