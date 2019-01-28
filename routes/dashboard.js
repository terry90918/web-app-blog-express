const express = require('express');
const router = express.Router();
const db = require('../connections/firebase_admin');

const categoriesRef = db.ref('/blog/categories/')

// const ref = db.ref('any');
// ref.once('value', (snapshot) => {
//   console.log('/dashboard', snapshot.val());
// });

router.get('/archives', (req, res, next) => {
  res.render('dashboard/archives', { title: 'Archives' });
});

router.get('/article', (req, res, next) => {
  res.render('dashboard/article', { title: 'Article' });
});

/* 取得文章分類 */
router.get('/categories', (req, res, next) => {
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
router.post('/categories/create', (req, res, next) => {
  const data = req.body;
  console.log('data', data)
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
        categoriesRef
          .orderByChild('path')
          .equalTo(data.path)
          .once('value')
          .then((snapshot) => {
            if (snapshot.val() !== null) {
              req.flash('info', '已有相同路徑');
              res.redirect('/dashboard/categories');
            } else {
              categoryRef
                .set(data)
                .then(() => {
                  res.redirect('/dashboard/categories');
                });
            }
          });
      }
    });
});

/* 刪除文章分類 */
router.post('/categories/delete/:id', (req, res, next) => {
  const id = req.param('id');
  categoriesRef.child(id).remove();
  req.flash('info', '欄位已刪除');
  res.redirect('/dashboard/categories');
});

module.exports = router;
