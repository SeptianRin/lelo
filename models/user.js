var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt =  require('bcrypt-nodejs');
var findOrCreate = require('mongoose-findorcreate')

var userSchema = new Schema({
	nama : {type: String , require: true},
	email : {type:String , require: true},
	password : {type : String , require : true},
	ktpurl : {type: String , require : true , default:'0'},
	authcontrol:{type: String,require: true},
	googleId: {type:String}
});

userSchema.methods.encryptPassword = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);

};

userSchema.methods.validPassword = function(password) {
	return bcrypt.compareSync(password, this.password);
};

userSchema.plugin(findOrCreate);

module.exports = mongoose.model('User', userSchema);