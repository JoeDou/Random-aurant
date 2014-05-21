var express = require('express');
var partials = require('express-partials');
var util = require('./lib/utility');

var handler = require('./lib/request-handler');

var app = express();

// app.set('views', __dirname + '/views');
// app.set('view engine', 'ejs');
app.use(partials());
app.use(express.bodyParser());
app.use(express.static(__dirname + '/../client'));
app.use(express.cookieParser('shhhh, very secret'));
app.use(express.session());

app.get('/', function(req, res){res.sendfile('./client/index.html');});

app.get('/restaurants', handler.fetchRestaurant);
app.post('/add', handler.addRestaurant);
app.post('/destination', handler.findDestination);
app.post('/login', handler.loginUser);
app.get('/logout', handler.logoutUser);
app.post('/signup', handler.signupUser);
app.post('/yelpsearch', handler.yelpSearch);

module.exports = app;
