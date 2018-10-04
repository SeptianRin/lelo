var express = require('express');
var router = express.Router();
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

module.exports = router;
