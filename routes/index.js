var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/',function(req, res, next) {
  res.render('index', { title: 'Node JS CURD',user: req.user  });
});

/* GET About page. */
router.get('/about', function(req,res,next){
  res.render('about',{title:'About'});
  
});

router.get('/contact',function(req,res){
  res.render('contact',{title:'Contact US'})
});

/* GET home page. */
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Node JS CURD',errors:''});
});

// GET /logout
router.get('/logout', function(req, res, next) {
  if (req.session) {
     //console.log(req);
     // delete session object
    req.session.destroy(function(err) {
      if(err) {
        return next(err);
      } else {
        return res.redirect('/login');
      }
    });
  }
});

module.exports = router;
