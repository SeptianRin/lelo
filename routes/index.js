var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var passport = require('passport');
var multer = require('multer');
var Cart = require('../models/cart');
var moment = require("moment");
var Barang = require('../models/barang');
var Order = require('../models/pesanan');
var Diskusi = require('../models/diskusi');
var User = require('../models/user');
var Bidding = require('../models/bidding');

/* GET home page. */
router.get('/', function(req, res, next) {
  var barangs = Barang.find(function (err, docs) {
  	var chunksBarang = [];
  	successMsg = req.flash('success')[0];
  	chunkSize = 4;
  	for(var i=0; i<docs.length;i+=chunkSize){
  		chunksBarang.push(docs.slice(i,i+chunkSize));
  	}
  	res.render('shop/index', { title: 'Lelang Online' ,  barangs : chunksBarang, successMsg : successMsg , noMessages: !successMsg });
  });
  
});

router.get('/about', function(req, res, next) {
  	res.render('shop/about');
  });

  router.get('/faq', function(req, res, next) {
  	res.render('shop/faq');
});


/* add to cart logic goes here */

router.get('/selesai/:id', function(req,res,next) {
	idBarang = req.params.id;
	Barang.findById(idBarang,function(err,produk){
		Bidding.find({product : idBarang}).sort({'lelang': -1}).limit(1).exec(function(err,docs){
			if (produk.pemenang == req.user._id) {
				req.flash('error', 'Belum ada pemenang untuk lelang ini');
				res.redirect('/');
			}
			else {
				if (produk.harga >  produk.hasil) {
				produk.hasil = produk.harga;
				produk.pemenang =  mongoose.Types.ObjectId(docs[0].user);
				req.flash('success', 'Berhasil menghentikan lelang');
				produk.save();
				res.redirect('/');
					} else {
				produk.pemenang =  mongoose.Types.ObjectId(docs[0].user);
				req.flash('success', 'Berhasil menghentikan lelang');
				produk.save();
				res.redirect('/');
			}
			}				
	});
	});
});


router.get('/add-to-cart/:id' , function(req, res, next) {
	var idBarang = req.params.id;
	var cart = new Cart(req.session.cart ? req.session.cart : {});

	Barang.findById(idBarang,function(err,product){
		if(err){
			return res.redirect('/');
		}
		cart.add(product , product.id);
		req.session.cart= cart;
		res.redirect('/');
	});
});

//CRUD

//create
router.get('/tambahbarang/',notBidder ,function(req, res,next){
  var messages = req.flash('error');
  var idUser =  req.user._id;
  res.render('shop/addbarang', {id:idUser,messages : messages, hasErrors: messages.length > 0});
});

router.post('/add-barang/',notBidder , function(req, res, next) {
  var barang =  new Barang({
  	  user : req.user._id,
      imagePath: req.body.gambar,
      judul: req.body.judul,
      deskripsi: req.body.deskripsi,
      harga: req.body.harga,
      pemenang: req.user._id
    });
    barang.save(function(err, result) {
      if(err){
      return res.redirect('/');
    } 
      req.flash('success', 'Successfully added barang');
      Barang.find({user:req.user._id}, function(err,produk){
      	console.log(result);
      	res.redirect('/barangsaya');
      });
      
    }); 
});

//read
router.get('/barangsaya/',notBidder,function(req, res,next){
  var messages = req.flash('error');
  Barang.find({user: req.user._id}, function (err,barang){
    if (err){
      return res.write('Error!');
    }
 	 res.render('shop/barangsaya', {messages : messages, barang : barang, hasErrors: messages.length > 0});
  });
  
});

//update
router.get('/edit-barang/:id',notBidder,function(req, res,next){
  var messages = req.flash('error');
  var idUser =  req.user._id;
  res.render('shop/editbarang', {id:idUser,messages : messages, hasErrors: messages.length > 0});
});

router.post('/edit-barang/:id',notBidder,function(req,res,next){
	var idBarang = req.params.id;
	Barang.findOneAndUpdate({_id :idBarang},{$set:{imagePath: req.body.gambar, judul: req.body.judul,deskripsi: req.body.deskripsi, harga: req.body.harga}},{new:true}, function(err,docs){
		if (err) {
			console.log(err);

		}
		console.log(docs);
		res.redirect('/barangsaya/');
	}); 
});

//delete
router.get('/hapus-barang/:id',notBidder,function(req,res,next){
	var idBarang = req.params.id;
		Barang.findOneAndRemove({_id :idBarang},function(err,docs){
		if (err) {
			console.log(err);

		}
		console.log(docs);
		res.redirect('/barangsaya/');
	}); 
});


router.post('/add-comment/:id', isLoggedIn , function(req, res, next) {
	var idBarang = req.params.id;
	var diskusi =  new Diskusi({
	  	user: mongoose.Types.ObjectId(req.user._id),
	  	product: mongoose.Types.ObjectId(idBarang),
	  	comment: req.body.komen,
	  	createdAt : Date.now()
	  });
	  diskusi.save(function(err, result) {
	  	req.flash('success', 'Successfully added comment');
	  	res.redirect('/detailproduk/'+idBarang);
	  });	
});

//callback oauth
//router.get('/auth/google', select.passport.authenticate('google',{scope: 'https://www.googleapis.com/auth/plus.me https://www.google.com/m8/feeds https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile'}));

router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile','email'] }));

router.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/user/signin' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });



//end of callback

router.post('/bidding/:id', isLoggedIn , function(req, res, next) {
	var idBarang = req.params.id;
	var diskusi =  new Bidding({
	  	user: mongoose.Types.ObjectId(req.user._id),
	  	product: mongoose.Types.ObjectId(idBarang),
	  	lelang: req.body.lelang
	  });
	  diskusi.save(function(err, result) {
	  	if(err){
			return res.redirect('/');
		}	
	  	req.flash('success', 'Successfully added bid');
	  	res.redirect('/detailproduk/'+idBarang);
	  });	
});

/* product detail goes here*/
router.get('/detailproduk/:id' , function(req, res, next) {
	var idBarang = req.params.id;
	successMsg = req.flash('success')[0];
	Barang.find({_id : idBarang}).exec(function(err,produk){
		if(err){
			return res.redirect('/');
		}	

		Diskusi.find({product : idBarang}).populate('user').populate('product').exec(function(err,diskusi){
		if(err){
			return res.redirect('/');
		}
			Bidding.find({product : idBarang}).sort({'lelang': -1}).limit(3).populate('user').populate('product').exec(function(err,bidding){
			if(err){
				return res.redirect('/');
			}
			//try to update the price of the goods
			Bidding.count({product :idBarang}, function(err, count){
			if(err){
				return res.redirect('/');
			}
			prodref = produk[0];
			if (count > 0){
				teratas =  bidding[0].lelang;
				Barang.findOne({_id:idBarang}, function(err, doc){
   				 if (err){
   				 	return res.redirect('/');
   				 } 
   				doc.hasil = teratas;
   				doc.save();
   				});
			}
			var ass=true;
			if(req.isAuthenticated()){
			if(req.user.ktpurl == "0" ){ass= false;} else{ass=true;}
			}
			res.render('shop/detailProduk', {ass:ass ,diskusi:diskusi, bidding: bidding ,  product:prodref ,count:count, successMsg : successMsg , noMessages: !successMsg});
	});		
	});
	});
	});	
	
});
/* product detail end */



/* search logic goes here*/
router.get('/search' , function(req, res, next) {
	var cari = req.query.q;

  	var barangs = Barang.find({judul:{ $regex: cari, $options: 'i' } },function (err, docs) {
  		//try paginating result
//  		var paginate = Barang.paginate({}, {page:1, limit: 8}, function(err,hasil){
  			var chunksBarang = [];
		  	successMsg = req.flash('success')[0];
		  	chunkSize = 4;
		  	for(var i=0; i<docs.length;i+=chunkSize){
		  		chunksBarang.push(docs.slice(i,i+chunkSize));
		  	}
		  	
		  	res.render('shop/search', {barangs : chunksBarang, keyword: cari});
//  		});
  });
});
/* search logic end */

/* cart logic goes here*/
router.get('/cart', function(req,res,next){

	if (!req.session.cart) {
		return res.render('shop/cart' , { barangs: null });
	}
	var cart = new Cart(req.session.cart);
	res.render('shop/cart', {barangs: cart.generateArray() , totalPrice : cart.totalPrice})

});

/* checkout get logic goes here
	1.	verify that user login
	
*/
router.get('/checkout', isLoggedIn , function (req, res, next) {
	if(!req.session.cart){
		return res.redirect('/cart');
	}
	var cart = new Cart(req.session.cart);
	var errMsg = req.flash('error')[0];
	res.render('shop/checkout', {total: cart.totalPrice, errMsg:errMsg, noErrors:!errMsg});
});

/* checkout post logic goes here
	1.payment with stripe (implemented)

*/
router.post('/checkout', isLoggedIn , function (req, res, next) {
	var cart = new Cart(req.session.cart);
	var stripe = require("stripe")("sk_test_mURkoMYInZPqPVc1RWYvi7kq");

	stripe.charges.create({
	  amount: cart.totalPrice * 100,
	  currency: "usd",
	  source: req.body.stripeToken , // obtained with Stripe.js
	  description: req.body.desc
	}, function(err, charge) {
	  if(err){
	  	req.flash('error', err.message);
	  	return res.redirect('/checkout');
	  }
	  var order =  new Order({
	  	user: req.user,
	  	cart: cart,
	  	address: req.body.address,
	  	name: req.body.name,
	  	paymentId: charge.id,
	  	desc: req.body.desc
	  });
	  order.save(function(err, result) {
	  	req.flash('success', 'Successfully bought product');
	  	req.session.cart = null;
	  	res.redirect('/');
	  });
	});
});

module.exports = router;



function notBidder(req , res , next) {
  if (req.user.authcontrol == '2') {
    return next();
  }
  req.session.oldUrl = req.url;
  res.redirect('/user/data');
}


function isLoggedIn(req , res , next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.session.oldUrl = req.url;
  res.redirect('/user/signin');
}