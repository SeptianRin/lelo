var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

var Schema = mongoose.Schema;

var schema = new Schema({
	user: {type: Schema.Types.ObjectId, ref: 'User'},
	imagePath: {type: String, require: true},
	judul: {type: String, require: true},
	deskripsi: {type: String, require: true},
	harga: {type: Number, require: true},
	hasil: {type: Number , require: true , default: 0},
	pemenang : {type:Schema.Types.ObjectId, ref:'User' , default:null}
},{
 	timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
 });
schema.plugin(mongoosePaginate);

module.exports = mongoose.model('Barang',schema);