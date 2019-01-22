var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var sassMiddleware = require('node-sass-middleware');

var routerIndex = require('./routes/index');
var routerPost = require('./routes/post/index');
var routerDashboardArchives = require('./routes/dashboard/archives/index');
var routerDashboardArticle = require('./routes/dashboard/article/index');
var routerDashboardCategories = require('./routes/dashboard/categories/index');
var routerDashboardSignup = require('./routes/dashboard/signup/index');

var app = express();

// view engine setup
app.locals.basedir = path.join(__dirname, 'views');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true, // true = .sass and false = .scss
  sourceMap: false
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routerIndex);
app.use('/post', routerPost);
app.use('/dashboard/archives', routerDashboardArchives);
app.use('/dashboard/article', routerDashboardArticle);
app.use('/dashboard/categories', routerDashboardCategories);
app.use('/dashboard/signup', routerDashboardSignup);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
