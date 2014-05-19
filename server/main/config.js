var mongoose = require('mongoose');

mongoose.connect(process.env.DB_URL || 'mongodb://localhost/myApp');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log('connected to MongoDB');
});

module.exports =  db;
