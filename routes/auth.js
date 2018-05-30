var express = require('express');
var router = express.Router();
var User = require('../models/user');
router.use(function(req,res,next){
   //if(req.baseUrl == '/prodcuts'){
     //res.redirect('/login');
   //}
  //console.log('reqested url'+req.baseUrl);
    //res.redirect('/login');
     next();
});

router.get('/',User.ensureAuthenticated,function(req,res){
    res.render('products',{title:'Product Page!'});
}); 

router.get('/login',function(req,res){
    res.render('login',{title:'Login Page!'});
});
module.exports = router;