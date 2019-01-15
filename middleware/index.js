const   Comment = require('../models/comment'),
        Campground = require('../models/campground');

const middlewareObj = {};

middlewareObj.checkCampOwner = function(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err){
                req.flash('error', "Yikes! That Campground Doesn't Exist, Maybe You Should Create It...")
                res.redirect('back');
            } else {
                if (!foundCampground) {
                    req.flash("error", "Campground not found.");
                    return res.redirect("back");
                }
                // if logged in do they own camp?
                if(foundCampground.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash('error', "You Don't Own That!")
                    res.redirect('back');
                }
            }
        })
    } else {
        req.flash('error', 'You Need To Login Or Create An Account First!')
        res.redirect('back');
    }
}

middlewareObj.checkCommentOwner = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                req.flash('error', "Yikes! That Comment Doesn't Exist, Maybe You Should Create It...")
                res.redirect('back');
            } else {
                if (!foundComment) {
                    req.flash("error", "Comment not found.");
                    return res.redirect("back");
                }
                // if logged in do they own camp?
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash('error', "You Don't Own That!")
                    res.redirect('back');
                }
            }
        })
    } else {
        req.flash('error', 'You Need To Login Or Create An Account First!')
        res.redirect('back');
    }
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash('error', 'You Need To Login Or Create An Account First!')
    res.redirect('/login');
}


module.exports = middlewareObj