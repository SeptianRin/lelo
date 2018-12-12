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
	imagePath: '../images/can.jpg',
	judul: 'Ngehe Banget',
	deskripsi: 'Cepet lelang barang ini',
	harga: 13

}),

new Barang({
	imagePath: '../images/b.png',
	judul: 'Banget Barunya',
	deskripsi: 'lelang sekarang gratis ongkri besok',
	harga: 19

}),

new Barang({
	imagePath: '../images/nyet.jpg',
	judul: 'Torrrrrrrrrr',
	deskripsi: 'LELAAANNNNNGGGGG!!!!',
	harga: 34

}),

new Barang({
	imagePath: '../images/ngantuk.jpg',
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
{ "email" : "test@test.com", "password" : "$2a$05$cGYt6MfgmZ5pzfUNUSWWreBxzuG0BBFVbGBIh5V5HV8OmIuPJc9q.", "__v" : 0 }
{ "email" : "hehe@hehe.com", "password" : "$2a$05$HiYbtQu4x16fmJ865GcwGeTKF.pci92VJCykUSUv1iebLve5.UQ0W", "__v" : 0 }
{ "email" : "ngehehe@gmail.com", "password" : "$2a$05$v5iLj3CA2pe1fIDu8T006O7q.9FLq6OpuS4yUI5UiVk7X7CYkSyV2", "__v" : 0 }
{ "_id" : ObjectId("5bed13237e92ba2290279479"), "email" : "trololol@mail.com", "password" : "$2a$05$.jeHUlnnPmGNyPVijkHXc.Qmrw1YnhQpzkPmRqcEj297lZ0qhY9gS", "__v" : 0 }
{ "_id" : ObjectId("5c03b117479a4e0ca8ffc16a"), "email" : "halo@halo.com", "password" : "$2a$05$e/n8OIbKt1YuoZee9PjUluK5RIJhmmcLDazz6Xf05pirgS.kgYaLq", "ktpurl" : "halohalohalo", "authcontrol" : "1", "__v" : 0 }
{ "_id" : ObjectId("5c03b168479a4e0ca8ffc16b"), "email" : "hohohihe@hohohihe.com", "password" : "$2a$05$vK651.ghGZ9NAA5vBXV3QubT81c5Ta3GGeX2.9RNqxBHuss2lERCy", "ktpurl" : "hohohihe", "authcontrol" : "2", "__v" : 0 }
{ "_id" : ObjectId("5c03bc09d9d8a52af0fff614"), "email" : "hoho@hoho.com", "password" : "$2a$05$iQdEDrP5BavRs66FtMOaHuL/P30XACeOHMvNYCPRL3YzrJOQQoqJ.", "ktpurl" : "hohohoho", "authcontrol" : "2", "__v" : 0 }
{ "_id" : ObjectId("5c0562988f648e2ca8d1da8c"), "googleId" : "110545443680659769886", "__v" : 0 }