var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');

var db = require('../main/config');
var User = require('../main/user');
var Restuarant = require('../main/restuarant');
// var Users = require('../app/collections/users');
// var Links = require('../app/collections/links');

exports.renderIndex = function(req, res) {
  res.render('index');
};

exports.addRestuarant = function(req, res){
  var name = req.body.name;
  var cost = req.body.cost;
  var distance = req.body.distance;

  console.log('add restuarant', req.body);

  Restuarant.findOne({ name: name }, 'name', function(err, restuarant){
    if (!restuarant) {
      var newRestuarant = new Restuarant({
        name: name,
        cost: cost,
        distance: distance,
        visits: 0
      });
      console.log('new restuarant', newRestuarant);

      newRestuarant.save(function(err, saved){
        console.log('saved restuarant', saved);
        res.send(200);
      });
    }else{
      console.log('restuarant found');
      res.send(200);
    }
  });
  res.redirect('/add');
};

exports.addForm = function(req, res) {
  res.render('add');
};

exports.renderDestination = function(req, res){
  res.render('desination');
  res.send(200);
};

exports.findDestination = function(req, res){
  // console.log('calculate destination', req.body);
  Restuarant.find({}, function(err, restuarantList){
    // console.log('this is the return', restuarantList);
    var array = applyWeighting(restuarantList, req.body);
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

    console.log('return array', array, index);

    res.send(200, array[index].name);
  });
};

var applyWeighting = function(list, factor){
  var array = [];
  totalUnits = {
    cost: 0,
    distance: 0,
    frequency: 0,
    maxVisit: 0
  };
  var total = 0;

  total = factor.cost*1 + factor.distance*1;
  // console.log('total:', total);

  for (var i = 0; i < list.length; i++) {
    totalUnits.cost += list[i].cost*1;
    totalUnits.distance += list[i].distance*1;
  }

  for (i = 0; i < list.length; i++) {
    sum = (list[i].cost/totalUnits.cost)*factor.cost +
          (list[i].distance/totalUnits.distance)*factor.distance;
    var range = sum / total;
    array.push({name: list[i].name, range: range});
  }

  // console.log('weighted array', array);
  return array;

};

