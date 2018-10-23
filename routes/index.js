var express = require('express');
var router = express.Router();
var Cart = require('../models/cart');

var Barang = require('../models/barang');


/* GET home page. */
router.get('/', function(req, res, next) {
  var barangs = Barang.find(function (err, docs) {
  	var chunksBarang = [];
  	chunkSize = 3;
  	for(var i=0; i<docs.length;i+=chunkSize){
  		chunksBarang.push(docs.slice(i,i+chunkSize));
  	}
  	res.render('shop/index', { title: 'Lelang Online' ,  barangs : chunksBarang });
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
		console.log(req.session.cart);
		res.redirect('/');
	});
});

router.get('/cart', function(req,res,next){

	if (!req.session.cart) {
		return res.render('shop/cart' , { barangs: null });
	}
	var cart = new Cart(req.session.cart);
	res.render('shop/cart', {barangs: cart.generateArray() , totalPrice : cart.totalPrice})

});

module.exports = router;
