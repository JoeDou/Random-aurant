var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');

var db = require('../main/config');
var User = require('../main/user');
var Restaurant = require('../main/restaurant');

var yelp = require("yelp").createClient({
  consumer_key: "SzQdSvtMTjV2G8zH-gzjKA",
  consumer_secret: "Npu_t0hsqBBmshtLJaL9NfRY_0Y",
  token: "B4EcDSSwlFUHkfYulefhH4QSVTwWarWS",
  token_secret: "GhyNIB8-tuJNcXahz_h4nICI7ng"
});

exports.addRestaurant = function(req, res){
  console.log(' add rest', req.body);

  var name = req.body.name;
  var cost = req.body.cost;
  var distance = req.body.distance;
  var rating = req.body.rating;
  var image_url = req.body.image_url;
  var phone = req.body.phone;
  var address = req.body.address;
  var url = req.body.url;

  console.log('add restaurant', req.body);

  Restaurant.findOne({ name: name }, 'name', function(err, restaurant){
    if (!restaurant) {
      var newRestaurant = new Restaurant({
        name: name,
        cost: cost,
        distance: distance,
        visits: 0,
        rating: rating,
        image_url: image_url,
        phone: phone,
        address: address,
        url: url
      });
      console.log('new restaurant', newRestaurant);

      newRestaurant.save(function(err, saved){
        // console.log('saved restaurant', saved);
        res.send(200, saved);
      });
    }
  });
};

exports.addForm = function(req, res) {
  res.render('add');
};

// exports.renderDestination = function(req, res){
//   res.render('desination');
//   res.send(200);
// };

exports.findDestination = function(req, res){
  // console.log('calculate destination', req.body);
  Restaurant.find({}, function(err, restaurantList){
    var factor = req.body;
    console.log('findDesination', factor);
    // console.log('this is the return', restaurantList);
    var array = util.applyWeighting(restaurantList, factor);
    var rand = Math.random();
    var aggregate = 0;
    var index = 0;
    // console.log(' pre while loop', rand, aggregate, index);
    while (rand > aggregate){
      aggregate = aggregate + array[index].range;
      index ++;
      // console.log('in while loop', rand, aggregate, index);
    }
    index--;

    // console.log('return array', array, index);

    res.send(200, array[index].name);

    Restaurant.findOne({name: array[index].name}, function(err, rest){
      rest.visits++;
      rest.save(function(err, saved){
        res.send(200, array[index].name);
      });
    })
  });
};

exports.fetchRestaurant = function(req, res) {
  //console.log('server recieved');
  Restaurant.find({}, function(err, links) {
    //console.log('server:', links);
    res.send(200, links);
  });
};

exports.loginUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  console.log('user db', req.body);

  User.findOne({username: username}, function(err, user){
    console.log('check session: ', req.session);
    if (!user) {
      console.log('user does not exist');
      res.send(401);
    }else if(req.session.user){
      if(req.session.user.username === username){
        console.log('session user: ', req.session.user.username);
        res.redirect('/');
        res.send(302)
      }
    }else{
      console.log('comparing password', password, user);
      user.comparePassword(password, function(match) {
        if (match) {
          util.createSession(req, res, user);
          console.log('redirect home');
          //res.redirect('/');
          res.send(200);

        } else {
          // console.log('wrong password');
          //res.redirect('/login');
          res.send(401);
        }
      });
    }
  });
};

exports.signupUser = function(req, res) {
  console.log('signing up user');
  var username = req.body.username;
  var password = req.body.password;

  User.findOne({ username: username }, 'username', function(err, user){
    if (!user) {
      var newUser = new User({
        username: username,
        password: password
      });
      // console.log('new user', newUser);

      newUser.save(function(err, saveduser){
        util.createSession(req, res, saveduser);
        //res.redirect('/login');
        res.send(200)
      });
    } else {
      console.log('Account already exists');
      //res.redirect('/login');
      res.send(302);
    }
  });
};

exports.logoutUser = function(req, res) {
  req.session.destroy(function(){
    res.send(200);
  });
};

exports.yelpSearch = function(req, res){
  console.log('http GET yelp', req.body);
  storeName = req.body.storeName;
  storeLocation = req.body.storeLocation;

  yelp.search({term: storeName, location: storeLocation}, function(error, data) {
    // var dataObj = JSON.parse(data);
    // console.log('return data', dataObj);

    if (error){
      console.log('yelp search errer');
    } else{
      res.send(200, data);
    }
  });
};


// yelp.business("chipotle-mexican-grill-san-francisco-4", function(error, data) {
//   console.log(error);
//   console.log(data);
// });
