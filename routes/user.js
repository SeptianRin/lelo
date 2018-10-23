var express = require('express');
var router = express.Router();
var Barang = require('../models/barang');
var csrf = require('csurf');
var passport = require('passport');

var csrfProtection = csrf();
router.use(csrfProtection);

router.get('/data' , isLoggedIn , function(req , res, next){
  res.render('user/data');
});

router.get('/logout' , isLoggedIn,  function( req , res , next){
  req.logout();
  res.redirect('/');
});


router.use('/', notLoggedIn, function(req , res , next){
  next();
});

router.get('/signup' , function(req , res , next){
  var messages = req.flash('error');
	res.render('user/signup', {csrfToken: req.csrfToken(), messages : messages, hasErrors: messages.length > 0});
});

router.post('/signup', passport.authenticate('local.signup', {
  successRedirect: '/user/data',
  failureRedirect: '/user/signup',
  failureFlash : true
}));

router.get('/signin',function(req, res,next){
  var messages = req.flash('error');
  res.render('user/signin', {csrfToken: req.csrfToken(), messages : messages, hasErrors: messages.length > 0});

});

router.post('/signin' , passport.authenticate('local.signin',{
  successRedirect: '/user/data',
  failureRedirect: '/user/signin',
  failureFlash : true
}));




module.exports = router;

function isLoggedIn(req , res , next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

function notLoggedIn(req , res , next) {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}