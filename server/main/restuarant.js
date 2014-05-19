var db = require('./config');
var crypto = require('crypto');
var mongoose = require('mongoose');

var restuarant = mongoose.Schema({
  name: String,
  lastVisit:  Date,
  cost: Number,
  distance: Number,
  visits: Number,
});

// restuarant.pre('save', function(next){
//   var shasum = crypto.createHash('sha1');
//   shasum.update(this.get('url'));
//   this.set('code', shasum.digest('hex').slice(0, 5));
//   next();
// });

var Restuarant = mongoose.model('restuarant', restuarant);

module.exports = Restuarant;
