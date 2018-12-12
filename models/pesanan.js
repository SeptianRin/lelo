var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
	user: {type: Schema.Types.ObjectId, ref: 'User'},
	cart: {type: Object,required: true},
	address: {type:String, required:true},
	name:{type:String, required:true},
	desc:{type:String, required:true},
	paymentId: {type:String, required:true}
 },
 {
 	timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
 });

module.exports = mongoose.model('Pesanan',schema);