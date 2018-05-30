var express = require('express');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var router = express.Router();

var User = require('./../models/user');

/* GET users listing. */
router.get('/',User.ensureAuthenticated, function(req, res, next) {
  var perPage = 3
  var page = req.params.page || 1
  /*User.find({}, function(err,users){
  if(err) throw err;
  res.render('userlist',{title:'User list',users});
  }); */
  User
  .find({})
  .skip((perPage*page) - perPage)
  .sort({name:'asc'})
  .limit(perPage)
  .exec(function(err,users){
    User.count().exec(function(err,count){
     if(err) throw err;
     res.render('userlist',{title:'User list',users:users,current:page,pages:Math.ceil(count / perPage)})
    });
  });
});

/* GET users listing. */
router.get('/:page',User.ensureAuthenticated, function(req, res, next) {
  var perPage = 3
  var page = req.params.page || 1
  /*User.find({}, function(err,users){
  if(err) throw err;
  res.render('userlist',{title:'User list',users});
  }); */
  User
  .find({})
  .skip((perPage*page) - perPage)
  .sort({name:'asc'})
  .limit(perPage)
  .exec(function(err,users){
    User.count().exec(function(err,count){
     if(err) throw err;
     res.render('userlist',{title:'User list',users:users,current:page,pages:Math.ceil(count / perPage)})
    });
  });
});
/* GET User Edit Page */
router.get('/edit/:id',User.ensureAuthenticated,function(req,res,next){
User.findOne({_id:req.params.id},function(err,user){
if(err) throw err;
res.render('edituser',{title:'Edit userinfomation',errors:'',user});
});
});
/* POST User Edit Page */
router.post('/edit/:id',User.ensureAuthenticated,function(req,res,next){
 User.findByIdAndUpdate({_id:req.params.id},{name:req.body.name,email:req.body.email},function(err,user){
  if(err) throw err;
  });
  req.flash('success_msg','User information successfully updated.');
  res.redirect('/users');
});
/* GET Delete user */
router.get('/delete/:id',User.ensureAuthenticated,function(req,res,next){
  User.remove({_id: req.params.id},function(err){
  if(err) throw err;
  req.flash('success_msg','User successfully deleted.');
  res.redirect('/users');
  });
});
/* GET Signup page*/
router.get('/signup',function(req, res, next) {
  res.render('signup',{title:'Create User',errors: ''});
});

/* GET user data */
router.post('/signup',function(req,res){
  var name = req.body.name;
  var username = req.body.username;
  var email = req.body.email;
  var password = req.body.password;
  var password2 = req.body.password2;


  //Validation 
  req.checkBody('name', 'Name is required Field.').notEmpty();
  req.checkBody('username','Username is required Filed.').notEmpty();
  req.checkBody('email','Email is required Filed.').notEmpty();
  req.checkBody('password','Password is required Field.').notEmpty();
  req.checkBody('password2','Password2 is required Field.').notEmpty();
  req.checkBody('password2','Password do not match').equals(req.body.password);
   var errors = req.validationErrors();

   if(errors){
     res.render('signup',{title:'Signup',errors});
     //console.log(errors)
   }else{
    var newUser = new User({
      name:name,
      username:username,
      email:email,
      password:password
    });
    console.log(newUser);
    User.createUser(newUser,function(err,user){
     if(err) throw err;
     console.log(user);
    });
    //console.log(req.isAuthenticated());
    if(req.isAuthenticated()){
     req.flash('success_msg', 'User Account successfully created');
     res.redirect('/users'); 
    }else{ 
    req.flash('success_msg', 'Account successfully created, please use your detail and login it.');
    res.redirect('/login');
    }
   }
}); 

passport.use(new LocalStrategy(
  function(username, password, done) {
   User.getUsername(username, function(err, user){
       if(err) throw err;
       if(!user){
           return done(null, false, {errors: 'Unknown User'});
       }

       User.comparePassword(password, user.password, function(err, isMatch){
           if(err) throw err;
           if(isMatch){
               return done(null, user);
           } else {
               return done(null, false, {errors: 'Invalid password'});
           }
       });
       
   });
   
}));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});
 
passport.deserializeUser(function(id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

router.post('/login',passport.authenticate('local', { failureRedirect: '/login'}),
function(req, res) {
  res.redirect('/');
});

module.exports = router;
