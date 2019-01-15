var     express = require('express'),
        router = express.Router(),
        mongoose = require('mongoose'),
        Comment = require('../models/comment'),
        middleware = require('../middleware/index'),
        Campground = require('../models/campground');

//index
router.get('/', function(req, res){
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        }
        else{
            res.render('campgrounds/index', {campgrounds: allCampgrounds});
        }
    });
});

//new form
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render('campgrounds/new');
});

//campground/create
router.post("/", middleware.isLoggedIn, function(req, res){
    var name = req.body.campName;
    var image = req.body.image;
    var desc = req.body.description;
    var price = req.body.price
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {name: name, image: image, description: desc, author: author, price: price};
    Campground.create(newCampground, function(err, newCamp){
        if(err){
            console.log(err);
        }
        else{
            req.flash('success', "You created a campground!")
            res.redirect('/campgrounds');
        }
    });
    
});

// show
router.get('/:id', function(req, res){
    Campground.findById(req.params.id).populate('comments').exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            if (!foundCampground) {
                req.flash("error", "Campground not found.");
                return res.redirect("back");
            }
            res.render('campgrounds/show', {campground: foundCampground});
        }
    })
})

//edit
router.get('/:id/edit', middleware.checkCampOwner, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render('campgrounds/edit', {campground: foundCampground});
    });
});

//update
router.put('/:id', middleware.checkCampOwner, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            res.redirect('/campgrounds');
        } else {
            if (!updatedCampground) {
                req.flash("error", "Campground not found.");
                return res.redirect("back");
            }
            req.flash('success', "You edited a campground!")
            res.redirect('/campgrounds/' + req.params.id);
        }
    })
})

router.delete('/:id', middleware.checkCampOwner, function(req, res){
    Campground.findByIdAndDelete(req.params.id, function(err){
        if(err){
            console.log(err);
        } else {
            req.flash('error', "You deleted a campground!")
            res.redirect('/campgrounds')
        };
    });
});

module.exports = router;