var express = require('express');
var router = express.Router();
var flash = require('connect-flash');

var mongo = require('mongodb');
var db = require('monk')('localhost/nodeblog');

/* GET Posts/add listing. */
router.get('/add', function(req, res, next) {
    res.render('addcategory', {
      'title': 'Add Category',
  });
});

router.post('/add', function (req, res, next){

  //Get the form values
  var name = req.body.name;


  //Form Validation
  req.checkBody('name', 'Please enter the name').notEmpty();

  //check errors
  var errors = req.validationErrors();

  if (errors){
    res.render('addcategory', { "errors": errors });
  }  else {
    var categories = db.get('categories')
    categories.insert({
      'name' : name,
    }, function(err, post){
      if (err){
        res.send(err);
      }else {
        req.flash('success', 'categories was added!');
        res.location('/');
        res.redirect('/');
      }
    })
  }
});


module.exports = router;
