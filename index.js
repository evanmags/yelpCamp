var express         = require('express'),
    app             = express(),
    bodyParser      = require('body-parser'),
    mongoose        = require('mongoose'),
    passport        = require('passport'),
    localStrategy   = require('passport-local'),
    flash           = require('connect-flash')
    Comment         = require('./models/comment'),
    Campground      = require('./models/campground'),
    User            = require('./models/user'),
    methodOverride  = require('method-override'),
    seedDB          = require('./seeds');

var commentRoutes   = require('./routes/comments'),
    campgroundRoutes   = require('./routes/campgrounds'),
    indexRoutes   = require('./routes/index');


// seedDB();
mongoose.connect('mongodb://localhost:27017/yelp_camp', {useNewUrlParser: true});
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(flash());
app.use(require('express-session')({
    secret: "yelpCamp is going to change my life",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
})
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.set('view engine', 'ejs');

app.use('/', indexRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);

app.listen(process.env.PORT || 3000, process.env.IP, function(){
    console.log("yelpCamp is up and hiking");
});