var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
	imagePath: {type: String, require: true},
	judul: {type: String, require: true},
	deskripsi: {type: String, require: true},
	harga: {type: Number, require: true}
});

module.exports = mongoose.model('Barang',schema);