var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var userSchema = mongoose.Schema({
    name:{type:String,index:true},
    username:{type:String,index:true},
    email:{type:String},
    password:{type:String}
});

var User = module.exports = mongoose.model('users',userSchema);

module.exports.createUser = function(newUser,callback){
 bcrypt.genSalt(10,function(err,salt){
     bcrypt.hash(newUser.password,salt,function(err,hash){
     if(err) throw err;
     newUser.password = hash;
     newUser.save(callback);
     console.log(newUser);
     });
 });
};

module.exports.getUsername = function(username, callback){
    var query = {username:username};
    User.findOne(query, callback);
    console.log(username);
    console.log(callback);
}

module.exports.getByid = function(id,callback){
    User.getByid(id,callback);
}

module.exports.comparePassword = function(password,hash,callback){
bcrypt.compare(password, hash, function(err, isMatch){
    if(err) throw err;
    callback(null, isMatch);
})
}

module.exports.ensureAuthenticated = function (req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/login');
	}
}