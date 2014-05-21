var db = require('./config');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');
var mongoose = require('mongoose');

var user = mongoose.Schema({
    username: String,
    password: String
  });

user.pre('save', function(next){
  var cipher = Promise.promisify(bcrypt.hash);
  cipher(this.password, null, null).bind(this)
    .then(function(hash) {
      this.password = hash;
      next();
    });
});

user.methods.comparePassword = function(attemptedPassword, callback) {
  console.log('in compare password', attemptedPassword, this.password);
  bcrypt.compare(attemptedPassword, this.password, function(err, isMatch) {
    callback(isMatch);
  });
};

var User = mongoose.model('user', user);

module.exports = User;