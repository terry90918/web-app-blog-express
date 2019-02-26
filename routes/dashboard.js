const express = require('express');
const router = express.Router();

/* === 插件 === */
const striptags = require('striptags');
const moment = require('moment');

/* === 模組 === */
const convertPagination = require('../modules/convertPagination');

/* === 資料庫 === */
const db = require('../connections/firebase_admin');
const categoriesRef = db.ref('/blog/categories/');
const articlesRef = db.ref('/blog/articles/');

// 後台首頁
router.get('/', (req, res) => {
  res.render('dashboard/index', {
    title: 'dashboard'
  });
});

/* 取得文章列表 */
router.get('/archives', (req, res) => {
  let articles = [];
  let categories = {};
  let currentPage = Number.parseInt(req.query.page) || 1; // 當前頁數
  let data = [];
  let page = {};
  let status = req.query.status || 'public';
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
        if (status === child.status) {
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
      res.render('dashboard/archives', {
        articles: data,
        categories,
        moment,
        page,
        status,
        striptags,
        title: 'Archives',
      });
    });
});

/* 取得新增文章的需要資訊 */
router.get('/article/create', (req, res) => {
  categoriesRef
    .once('value')
    .then((snapshot) => {
      const categories = snapshot.val();
      res.render('dashboard/article', {
        categories,
        title: 'Article Create'
      });
    });
});

/* 取得更新文章的需要資訊 */
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
      res.render('dashboard/article', {
        article,
        categories,
        title: 'Article: ' + id
      });
    });
});

/* 新增文章 */
router.post('/article/create', (req, res) => {
  const data = req.body;
  const articleRef = articlesRef.push();
  const key = articleRef.key;
  const updateTime = Math.floor(Date.now() / 1000);
  data.id = key;
  data.update_time = updateTime;
  articleRef
    .set(data)
    .then(() => {
      res.redirect(`/dashboard/article/${key}`);
    });
});

/* 更新文章 */
router.post('/article/update/:id', (req, res) => {
  const data = req.body;
  const id = req.params.id;
  articlesRef
    .child(id)
    .update(data)
    .then(() => {
      res.redirect(`/dashboard/article/${id}`);
    });
});

/* 刪除文章 */
router.post('/article/delete/:id', (req, res) => {
  const id = req.params.id;
  articlesRef
    .child(id)
    .remove()
    .then(() => {
      req.flash('info', '文章刪除成功');
      res.send('文章刪除成功');
    })
    .catch((error) => {
      req.flash('info', '文章刪除失敗: ' + error.message);
      res.send('文章刪除失敗');
    });
});

/* 取得文章分類 */
router.get('/categories', (req, res) => {
  // info: 伺服器與客戶端溝通暫時儲存資料的地方, 來至於 req.flash('info', '欄位已刪除');
  const message = req.flash('info');
  categoriesRef.once('value').then((snapshot) => {
    const categories = snapshot.val();
    res.render('dashboard/categories', {
      categories,
      hasInfo: message.length > 0,
      message,
      title: 'Categories',
    });
  });
});

/* 新增文章分類 */
router.post('/categories/create', (req, res) => {
  const data = req.body;
  const categoryRef = categoriesRef.push();
  const key = categoryRef.key;
  data.id = key;
  categoriesRef
    .orderByChild('name')
    .equalTo(data.name)
    .once('value')
    .then((snapshot) => {
      if (snapshot.val() !== null) {
        req.flash('info', '已有相同分類名稱');
        res.redirect('/dashboard/categories');
      } else {
        return Promise.resolve('Success');
      }
    })
    .then(() => {
      return categoriesRef
        .orderByChild('path')
        .equalTo(data.path)
        .once('value');
    })
    .then((snapshot) => {
      if (snapshot.val() !== null) {
        req.flash('info', '已有相同路徑');
        res.redirect('/dashboard/categories');
      } else {
        return Promise.resolve('Success');
      }
    })
    .then(() => {
      categoryRef
        .set(data)
        .then(() => {
          res.redirect('/dashboard/categories');
        });
    });
});

/* 刪除文章分類 */
router.post('/categories/delete/:id', (req, res) => {
  const id = req.params.id;
  categoriesRef.child(id).remove();
  req.flash('info', '欄位已刪除');
  res.redirect('/dashboard/categories');
});

module.exports = router;
