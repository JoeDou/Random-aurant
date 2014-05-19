var express = require('express');
var partials = require('express-partials');
var util = require('./lib/utility');
var connect = require('connect');

var handler = require('./lib/request-handler');

var app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(partials());
app.use(connect.bodyParser());
//app.use('/bower_components',express.static(__dirname + '/bower_components'));
app.use(express.static(__dirname + '/public'));
//app.use(connect.cookieParser('shhhh, very secret'));
//app.use(connect.session());


app.get('/', handler.renderIndex);

app.get('/add', handler.addForm);
app.post('/add', handler.addRestuarant);

app.get('/destination', handler.renderDestination);
app.post('/destination', handler.findDestination);

// app.get('/login', handler.loginUserForm);
// app.post('/login', handler.loginUser);
// app.get('/logout', handler.logoutUser);

// app.get('/signup', handler.signupUserForm);
// app.post('/signup', handler.signupUser);

// app.get('/*', handler.navToLink);

module.exports = app;
