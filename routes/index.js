var     express = require('express'),
        router = express.Router(),
        passport = require('passport'),
        middleware = require('../middleware/index'),
        User = require('../models/user');
        
//route
router.get("/", function(req, res){
    res.render('landing');
});

//register/form
router.get('/register', function(req, res){
    res.render('register', {Title: 'Register'})
})

//register/user/create
router.post('/register', function(req, res){
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if(err){
            req.flash('error', err.message)
            return res.redirect('/register')
        }
        passport.authenticate('local')(req, res, function(){
            req.flash('error', 'Welcome to yelpCamp, ' + user.username)
            res.redirect('/campgrounds')
        });
    });
});

//login
router.get('/login', function(req, res){
    res.render('login');
});

router.post('/login',  passport.authenticate('local', {
                    successRedirect: '/campgrounds',
                    failureRedirect: '/login'
                    }), 
    function(req, res){
});

//logout
router.get('/logout', function(req, res){
    req.logout();
    req.flash('success', 'You have successfully logged out')
    res.redirect('/campgrounds');
});

module.exports = router;