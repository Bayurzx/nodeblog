var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({dest: './uploads'});
var flash = require('connect-flash');

var mongo = require('mongodb');
var db = require('monk')('localhost/nodeblog');

/* GET Posts/add listing. */
router.get('/add', function(req, res, next) {
  var categories = db.get('categories');
  categories.find({}, {}, function(err, categories){
    res.render('addpost', {
      'title': 'Add Posts',
      'categories': categories
    });

  });
});

router.post('/add', upload.single('mainimage'), function (req, res, next){

  //Get the form values
  var title = req.body.title;
  var category = req.body.category;
  var body = req.body.body;
  var author = req.body.author;
  var date = new Date();

// Check to see if there is a file upload
  if (req.file){
    var mainimage = req.file.filename;
  }else {var mainimage = 'noimage';}

  //Form Validation
  req.checkBody('title', 'Please enter the title').notEmpty();
  req.checkBody('category', 'Please enter the category').notEmpty();
  req.checkBody('body', 'Please enter the body').notEmpty();
  req.checkBody('author', 'Please select the author').notEmpty();

  //check errors
  var errors = req.validationErrors();

  if (errors){
    res.render('addpost', { "errors": errors });
  }  else {
    var posts = db.get('posts')
    posts.insert({
      'title' : title,
      'body' : body,
      'category' : category,
      'date' : date,
      'author' : author,
      'mainimage' : mainimage,
    }, function(err, post){
      if (err){
        res.send(err);
      }else {
        req.flash('success', 'Post was added!');
        res.location('/');
        res.redirect('/');
      }
    })
  }
});


module.exports = router;
