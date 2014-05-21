var app = angular.module('myApp', ['ngRoute']);

app.controller('restaurantController', function($scope, restaurantService){
  restaurantService.all().success(function(data, status){
    console.log('returned all data:', data)
    $scope.restaurants = data;
  });
});

app.controller('drawController', function($scope, restaurantService){
  $scope.showDraw = false;
  $scope.update = function(factor){
    console.log('in drawController:', factor);
    restaurantService.draw(factor).success(function(data, status){
      console.log('status:', data, status );
      $scope.resDraw = data;
      $scope.showDraw = true;
    });
  };
});

app.controller('loginController', function($scope, restaurantService){
  $scope.update = function(user){
    console.log('in loginController:', user);
    restaurantService.login(user).success(function(data, status){
      console.log('login response status', status);
      window.location = '/';
    }).error(function(data, status, headers, config) {
      console.log('error status');
    });
  };
});


app.controller('logoutController', function($scope, restaurantService){
  $scope.update = function(){
    //console.log('in loginController:', user);
    restaurantService.logout().success(function(data, status){
      //console.log('login status:', data, status );
      window.location = '/#/login';
    });
  };
});

app.controller('signupController', function($scope, restaurantService){
  $scope.update = function(user){
    console.log('in signupController:', user);
    restaurantService.signup(user).success(function(data, status){
      console.log('status:', data, status );
      window.location = '/#/login';
    }).error(function(data, status, headers, config) {
      console.log('error status', data);
      window.location = '/#/login';
    });
  };
});

app.factory('restaurantService', function($http){
  var all = function() {
    return $http({
      method:'GET',
      url:'http://localhost:4568/restaurants'
    });
  };

  var add = function(restaurant){
    return $http({
      method:'POST',
      url:'http://localhost:4568/add',
      data: {
        'name': restaurant.name,
        'cost': restaurant.cost,
        'distance': restaurant.distance,
        'rating': restaurant.rating,
        'image_url': restaurant.image_url,
        'phone': restaurant.phone,
        'address': restaurant.address,
        'url': restaurant.url
      }
    });
  };

  var draw = function(factor){
    console.log('draw post');
    return $http({
      method: 'POST',
      url:'http://localhost:4568/destination',
      data: {
        'frequency': factor.frequency,
        'cost': factor.cost,
        'distance': factor.distance
      }
    });
  };

  var login = function(user){
    console.log('sending login post', user);
    return $http({
      method: 'POST',
      url:'http://localhost:4568/login',
      data: {
        'username': user.username,
        'password': user.password
      }
    });
  };

  var logout = function(){
    console.log('sending logout post');
    return $http({
      method: 'GET',
      url:'http://localhost:4568/logout',
    });
  };


  var signup = function(user){
    console.log('sending signup post');
    return $http({
      method: 'POST',
      url:'http://localhost:4568/signup',
      data: {
        'username': user.username,
        'password': user.password
      }
    });
  };

  return {
    all: all,
    add: add,
    draw: draw,
    login: login,
    signup: signup,
    logout: logout
  };
});

app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: './templates/home.html',
        controller: 'restaurantController'
      }).
      when('/add', {
        templateUrl: './templates/add.html',
        controller: 'yelpController'
      }).
      when('/draw', {
        templateUrl: './templates/draw.html',
        controller: 'drawController'
      }).
      when('/login', {
        templateUrl: './templates/login.html',
        controller: 'loginController'
      }).
      when('/signup', {
        templateUrl: './templates/signup.html',
        controller: 'signupController'
      }).
      otherwise({
        redirectTo: '/'
      });
  }]);

app.controller('yelpController',function($scope, yelpService, restaurantService){
  $scope.selectedSearch = {};

  $scope.search = function(search){
    console.log('yelp search');
    yelpService.search(search).success(function(data, status){
      console.log('yelp search status:', status);
      console.log('data', data);
      $scope.searchData = data.businesses;
    }).error(function(data, status, headers, config) {
      console.log('yelp search error status', status);
    });
  };

  $scope.update = function(restaurant){
    console.log('yelpController:', $scope.selectedSearch);
    restaurant.name = $scope.selectedSearch.name;
    restaurant.rating = $scope.selectedSearch.rating;
    restaurant.image_url = $scope.selectedSearch.image_url;
    restaurant.phone = $scope.selectedSearch.phone;
    restaurant.address = $scope.selectedSearch.location.address[0];
    restaurant.url = $scope.selectedSearch.url;

    console.log('saved restaurant data', restaurant);

    restaurantService.add(restaurant).success(function(data, status){
      console.log('status:', data, status );
    });
  };

  $scope.addName = function(search){
    console.log('search data addName', search);
    $scope.selectedSearch = search;
  };
});

app.factory('yelpService', function($http){
  var search = function(search){
    console.log('search yelp');
    return $http({
      method: 'POST',
      url:'http://localhost:4568/yelpsearch',
      data:{
        storeName: search.storeName,
        storeLocation: search.storeLocation
      }
    });
  };
  return {
    search:search
  };
});

// app.controller('addController', function($scope, restaurantService){
//   $scope.showLink = false;
//   $scope.update = function(restaurant){
//     console.log('addController:', restaurant);
//     restaurantService.add(restaurant).success(function(data, status){
//       console.log('status:', data, status );
//       $scope.resRestaurant = data;
//       $scope.showRestaurant = true;
//     });
//   };
// });
