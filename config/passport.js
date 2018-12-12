var passport = require('passport');
var User = require('../models/user');
var LocalStrategy = require('passport-local').Strategy;
var multer = require('multer');


passport.serializeUser(function(user,done){
	done(null, user.id);
});

passport.deserializeUser(function(id, done){
	User.findById(id, function(err, user){
		done(err, user);
	});
});

passport.use('local.signup', new LocalStrategy({
	usernameField: 'email',
	passwordField: 'password',
	passReqToCallback: true
}, function(req, email, password, done){
	req.checkBody('email', 'Invalid email').notEmpty().isEmail();
	req.checkBody('password', 'Invalid password').notEmpty().isLength({min:8});
	
	var errors = req.validationErrors();
	if(errors){
		var messages = [];
		errors.forEach(function(error){
			messages.push(error.msg);
		});
		return done(null, false, req.flash('error', messages));
	}
	User.findOne({'email': email}, function(err , user){
		if (err) {
			return done(err);
		}
		if (user) {
			return done(null, false , {message : 'Email is already in use'});
		}
		var newUser = new User();
		newUser.nama = req.body.nama;
		newUser.email = email;
		newUser.password = newUser.encryptPassword(password);
		newUser.authcontrol = req.body.option;
		newUser.save(function(err, result){
			if(err){
				return done(err);
			}
			return done(null,newUser);
		});

	});
}));

passport.use('local.signin', new LocalStrategy({
	usernameField: 'email',
	passwordField: 'password',
	passReqToCallback: true
}, function(req , email , password , done) {
	req.checkBody('email', 'Invalid email').notEmpty().isEmail();
	req.checkBody('password', 'Invalid password').notEmpty();
	var errors = req.validationErrors();
	if(errors){
		var messages = [];
		errors.forEach(function(error){
			messages.push(error.msg);
		});
		return done(null, false, req.flash('error', messages));
	}
	User.findOne({'email': email}, function(err , user){
		if (err) {
			return done(err);
		}
		if (!user) {
			return done(null, false , {message : 'No user found.'});
		}
		if (!user.validPassword(password)) {
			return done(null, false , {message : 'wrong password'});	
		}
		
		return done(null,user);

	});
}));

//nyoba OAUTH GOOGLE CUY

var GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    clientID: "528648393294-a7dq6qcie4h70li5rd1njuj8muhhe08p.apps.googleusercontent.com",
    clientSecret: "FsePcjUQ0JTRJYAMrJZFTXgE",
    callbackURL: "http://localhost:3000/auth/google/callback"
  },
  function(accessToken, refreshToken, profile , cb) {
  	console.log(profile);
    User.findOrCreate({nama : profile.displayName , authcontrol:"1" , googleId: profile.id , email: profile.emails[0].value }, function (err, user) {
    	//console.log(openid);
    	//console.log(profile);
      return cb(err, user);
    });
  }
));
