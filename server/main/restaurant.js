var db = require('./config');
var crypto = require('crypto');
var mongoose = require('mongoose');

var restaurant = mongoose.Schema({
  name: String,
  cost: Number,
  distance: Number,
  visits: Number,
  rating: Number,
  image_url: String,
  phone: Number,
  address: String,
  url: String,
});

var Restaurant = mongoose.model('restaurant', restaurant);

module.exports = Restaurant;
