var request = require('request');

exports.applyWeighting = function(list, factor){
  console.log('apply', list, factor);
  var array = [];
  totalUnits = {
    cost: 0,
    distance: 0,
    frequency: [],
  };
  var total = 0;

  total = factor.cost*1 + factor.distance*1 + factor.frequency*1;
  // console.log('total:', total);

  for (var i = 0; i < list.length; i++) {
    totalUnits.cost += list[i].cost*1;
    totalUnits.distance += list[i].distance*1;
    totalUnits.frequency.push(list[i].visits);
  }
  totalUnits.frequency.sort(function(a,b){return a-b});
  console.log('sorted frequency', totalUnits.frequency);

  for (i = 0; i < list.length; i++) {
    sum = (list[i].cost/totalUnits.cost)*factor.cost +
          (list[i].distance/totalUnits.distance)*factor.distance +
          findFrequencyFactor(totalUnits.frequency, list[i].visits, factor.frequency);
    var range = sum / total;
    array.push({name: list[i].name, range: range});
  }

  console.log('weighted array', array);
  return array;

};

var findFrequencyFactor = function(frequencyArray, visit, factor){
  var totalUnit = (1+frequencyArray.length)*frequencyArray.length/2;
  var index = frequencyArray.indexOf(visit);
  var i = index+1;
  var sum = index+1;

  while((frequencyArray[i] === frequencyArray[index]) || 
        (i < frequencyArray.length)){
    sum = sum+i+1;
    i++;
  }

  var output = ((sum/(i-index))/totalUnit)*factor;
  return output; 
}

exports.isLoggedIn = function(req, res) {
  return req.session ? !!req.session.user : false;
};

exports.checkUser = function(req, res, next) {
  if (!exports.isLoggedIn(req)) {
    res.redirect('/login');
  } else {
    next();
  }
};

exports.createSession = function(req, res, newUser) {
  return req.session.regenerate(function() {
      req.session.user = newUser;
      //res.redirect('/');
    });
};
