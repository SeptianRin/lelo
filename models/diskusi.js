var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
	user: {type: Schema.Types.ObjectId, ref: 'User'},
	product: {type: Schema.Types.ObjectId,ref: 'Barang'},
	comment: {type:String, required:true},

 },
 {
 	timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
 }
 );

module.exports = mongoose.model('Diskusi',schema);