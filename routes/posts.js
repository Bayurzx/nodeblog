var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({dest: './public/images/uploaded'});
var flash = require('connect-flash');

var mongo = require('mongodb');
var db = require('monk')('localhost/nodeblog');

/* Show full Story. */
router.get('/show/:id', function(req, res, next) {
  var posts = db.get('posts');
  posts.findById(req.params.id, function(err, post){
    res.render('show', {
      'post': post
    });
  });
});

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
  console.log(req.body.mainimage)

// Check to see if there is a file upload
  if (req.file){
    var mainimage = req.file.filename;
  }else {var mainimage = 'noimage.jpg';}

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

//***************
//comment section
//***************

router.post('/addcomment', function (req, res, next){

  //Get the form values
  var name = req.body.name;
  var email = req.body.email;
  var body = req.body.body;
  var postid = req.body.postid;
  var commentdate = new Date();

  //Form Validation
  req.checkBody('name', 'Please enter the name').notEmpty();
  req.checkBody('body', 'Please enter the body').notEmpty();
  req.checkBody('email', 'The email is required but never displayed').notEmpty();

  //check errors
  var errors = req.validationErrors();

  if (errors){
    var posts = db.get('posts');
    posts.findById(postid, function(err, post){
      res.render('show', {
         "errors": errors,
         "post": post
      });
    });
  } else {
      var comments ={
        "name":name,
        "email":email,
        "body":body,
        "commentdate":commentdate,
      }

      var posts = db.get('posts');

      posts.update({
        "_id":postid,
      }, {
        $push:{
          "comments": comments
        }
      }, function(err, doc){
        if (err){
          throw err;
        }else {
          req.flash('success', 'Comment was added');
          res.location('/posts/show/'+ postid);
          res.redirect('/posts/show/'+ postid);
        }
      });
  }
});



module.exports = router;
