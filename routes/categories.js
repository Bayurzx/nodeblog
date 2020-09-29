var express = require('express');
var router = express.Router();
var flash = require('connect-flash');

var mongo = require('mongodb');
var db = require('monk')('localhost/nodeblog');

router.get('/show/:category', function(req, res, next) {
  var posts = db.get('posts');
  posts.find({category: req.params.category}, {}, function(err, posts){
    res.render('index', {
      'title': req.params.category,
      'posts': posts
    });
  });
});

// Trying to only stories related to Author
router.get('/show/:author', function(req, res, next) {
  var auth = db.get('posts');
  auth.find({author: req.params.author}, {}, function(err, posts){
    res.render('index', {
      'title': req.params.author,
      'posts': posts
    });
  });
});


/* GET Posts/add listing. */
router.get('/add', function(req, res, next) {
    res.render('addcategory', {
      'title': 'Add Category',
  });
});

router.post('/add', function (req, res, next){

  //Get the form values
  var category = req.body.category;
  var author = req.body.author;



  //Form Validation
  req.checkBody('category', 'Please enter the category').notEmpty();
  req.checkBody('author', 'Please enter the author').notEmpty();

  //check errors
  var errors = req.validationErrors();

  if (errors){
    res.render('addcategory', { "errors": errors });
  }  else {
    var categories = db.get('categories')
    categories.insert({
      'name' : category,
      'author' : author,

    }, function(err, post){
      if (err){
        res.send(err);
      }else {
        req.flash('success', category+' category and the author '+author+' was added!');
        res.location('/');
        res.redirect('/');
      }
    })
  }
});


module.exports = router;
