var     express = require('express'),
        router = express.Router({mergeParams: true}),
        Comment = require('../models/comment'),
        middleware = require('../middleware/index'),
        Campground = require('../models/campground');
        
//comments/new
router.get('/new', middleware.isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            console.log(err)
            res.redirect('/campgrounds')
        } else {
            if (!foundCampground) {
                req.flash("error", "Campground not found.");
                return res.redirect("back");
            }
            res.render('comments/new', {campground: foundCampground});
        }
    });
});

//comments/create
router.post('/', middleware.isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            console.log(err)
        } else {
            if (!foundCampground) {
                req.flash("error", "Campground not found.");
                return res.redirect("back");
            }
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                } else {
                    comment.author.username = req.user.username;
                    comment.author.id = req.user._id;
                    comment.save();
                    foundCampground.comments.push(comment);
                    foundCampground.save();
                    req.flash('success', "You added a comment!")
                    res.redirect('/campgrounds/' + foundCampground._id);
                }
            })
        }
    });
});

//comments edit route
router.get('/:comment_id/edit', middleware.checkCommentOwner, function(req, res){
    Comment.findById(req.params.comment_id, function(err, comment){
        if(err){
            res.redirect('back');
        } else {
            if (!comment) {
                req.flash("error", "Comment not found.");
                return res.redirect("back");
            }
            res.render('comments/edit', {campground_id: req.params.id, comment: comment}); 
        }
    });
})

// comment/update
router.put('/:comment_id', middleware.checkCommentOwner, function(req, res){
    Comment.findOneAndUpdate(req.params.comment_id, req.body.comment, function(err, comment){
        if(err){
            res.redirect('back');
        } else {
            if (!comment) {
                req.flash("error", "Comment not found.");
                return res.redirect("back");
            }
            req.flash('success', "You edited a comment!")
            res.redirect('/campgrounds/' + req.params.id); 
        }
    });
});

// comment/destroy
router.delete('/:comment_id', middleware.checkCommentOwner, function(req, res){
    Comment.findByIdAndDelete(req.params.comment_id, function(err){
        if(err){
            res.redirect('back');
        } else {
            req.flash('error', "You deleted a comment!")
            res.redirect('/campgrounds/' + req.params.id); 
        }
    });
});

module.exports = router;