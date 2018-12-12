var Diskusi = require('../models/diskusi');
var mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/lelo', { useNewUrlParser: true });

var diskusi =[

new Diskusi({
	user : mongoose.Types.ObjectId("5bed13237e92ba2290279479"),
	product: mongoose.Types.ObjectId("5bc5eb654d76300ad041cdd0"),
	comment : 'A aja'
}),

new Diskusi({
	user : mongoose.Types.ObjectId("5bed13237e92ba2290279479"),
	product: mongoose.Types.ObjectId("5bc5eb654d76300ad041cdcd"),
	comment : 'B aja'

}),

new Diskusi({
	user : mongoose.Types.ObjectId("5bed13237e92ba2290279479"),
	product: mongoose.Types.ObjectId("5bc5eb654d76300ad041cdd0"),
	comment : 'C aja'
}),

new Diskusi({
	user : mongoose.Types.ObjectId("5bed13237e92ba2290279479"),
	product: mongoose.Types.ObjectId("5bc5eb654d76300ad041cdcd"),
	comment : 'D aja'
}),

new Diskusi({
	user : mongoose.Types.ObjectId("5bed13237e92ba2290279479"),
	product: mongoose.Types.ObjectId("5bc5eb654d76300ad041cdd0"),
	comment : 'E aja'
}),

];

var done = 0;
for (var i=0; i < diskusi.length; i++){
	diskusi[i].save(function (err,result) {
		done++;
		if (done === diskusi.length) {
			exit();
		}

	});

}

function exit() {
	mongoose.disconnect();
}