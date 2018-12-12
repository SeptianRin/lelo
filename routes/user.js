var express = require('express');
var router = express.Router();
var Barang = require('../models/barang');
var multer = require('multer');
var csrf = require('csurf');
var passport = require('passport');
var path = require('path')
var Order = require('../models/pesanan');
var Cart = require('../models/cart');
var Barang = require('../models/barang');
var User = require('../models/user');

//multer save in disk
  var storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, 'public/images/uploads');
      },
      filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now()+ path.extname(file.originalname));
      }
  });
  var upload = multer({
    storage: storage,
    limits : {fileSize:1000000},
    fileFilter: function(req, file ,cb){
      checkFileType(file,cb);
    }

  }).single('urlktp');


    router.get('/uploadfile',function(req,res){
        res.render('user/cobaupload');
    });
    
 // mutler fileUpload
    router.post('/uploadfile', function(req,res){
      err = req.flash('error', 'anda sudah memasukan ktp');
        upload(req,res,function(err){
          if(err){
            res.render('user/cobaupload', {msg: err});
          } else{
            console.log(req.file);
            User.findOne({_id:req.user._id} ,function(err,doc){
              doc.ktpurl = '../images/uploads/'+req.file.filename;
              doc.save();
              console.log(doc.ktpurl + req.file.filename);
              req.flash('success', 'Successfully upload ktp');
              res.redirect('user/data');
            });            
          }
        });
    });
  var csrfProtection = csrf();
  router.use(csrfProtection);

router.get('/data' , isLoggedIn , function(req , res, next){
  Order.find({user: req.user}, function (err,orders){
    if (err){
      return res.write('Error!');
    }
    var cart;
    orders.forEach(function(order) {
        cart = new Cart(order.cart);
        order.items =  cart.generateArray();
    });

    Barang.find({pemenang:req.user._id},function(err,produk){

      var pemilik= false;
      var local = false;
      var wado =req.user;
      if(req.user.authcontrol == "1") {pemilik=false;} else {pemilik=true;}
      if(req.user.ktpurl == "0" ){ass= false;} else{ass=true;}
       res.render('user/data',{produk:produk , wado : wado ,ass:ass,pemilik : pemilik,orders:orders , local: local });
    });
  });
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
  failureRedirect: '/user/signup',
  failureFlash : true
}), function(req,res,next) {
  if(req.session.oldUrl){
    var oldUrl = req.session.oldUrl;
    req.session.oldUrl = null; 
    res.redirect(oldUrl);
  }
  else{
    res.redirect('/user/data')
  }
});

router.get('/signin',function(req, res,next){
  var messages = req.flash('error');
  res.render('user/signin', {csrfToken: req.csrfToken(), messages : messages, hasErrors: messages.length > 0});

});

router.post('/signin' , passport.authenticate('local.signin',{
  
  failureRedirect: '/user/signin',
  failureFlash : true
}), function(req,res,next) {
  if(req.session.oldUrl){
    var oldUrl = req.session.oldUrl;
    req.session.oldUrl = null; 
    res.redirect(oldUrl);
  }
  else{
    res.redirect('/user/data')
  }
});



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

function noKTP(req , res , next) {
  if (req.user.ktpurl == "0") {
    return next();
  }
  req.session.oldUrl = req.url;
  res.redirect('/user/data');
}

//checkFileType function
  function checkFileType(file,cb) {
    //allowed ext
    const filetype = /jpeg|jpg|png|gif/;
    //check ext
    const extname = filetype.test(path.extname(file.originalname).toLowerCase());
    //check mimetype
    const mimetype = filetype.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    }else{
      cb('Error : Hanya Gambar');
    }
  }