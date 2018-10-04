var Barang = require('../models/barang');

var mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/lelo', { useNewUrlParser: true });

var barang =[

new Barang({
	imagePath: '../images/lelo.png',
	judul: 'Gosick Gambar',
	deskripsi: 'bagus banget lo kaka silakan lelang',
	harga: 12

}),

new Barang({
	imagePath: '../images/lelo.png',
	judul: 'Gosick Gambar',
	deskripsi: 'bagus banget lo kaka silakan lelang',
	harga: 12

}),

new Barang({
	imagePath: '../images/lelo.png',
	judul: 'Ngehe Banget',
	deskripsi: 'Cepet lelang barang ini',
	harga: 13

}),

new Barang({
	imagePath: '../images/lelo.png',
	judul: 'Banget Barunya',
	deskripsi: 'lelang sekarang gratis ongkri besok',
	harga: 19

}),

new Barang({
	imagePath: '../images/lelo.png',
	judul: 'Torrrrrrrrrr',
	deskripsi: 'LELAAANNNNNGGGGG!!!!',
	harga: 34

}),

new Barang({
	imagePath: '../images/lelo.png',
	judul: 'LPLPPLOLOLOLOL',
	deskripsi: 'LELAAANNNadsSdasdaDSANNGGGGG!!!!',
	harga: 50

}),

];

var done = 0;
for (var i=0; i < barang.length; i++){
	barang[i].save(function (err,result) {
		done++;
		if (done === barang.length) {
			exit();
		}

	});

}

function exit() {
	mongoose.disconnect();
}