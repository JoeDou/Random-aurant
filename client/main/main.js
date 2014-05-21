(function (angular) {
  "use strict";
  angular.module('myApp.main', ['ui.router', 'myApp.main.note'])
  .config(function ($stateProvider) {
    $stateProvider
      .state('myApp.main', {
        url: '/main',
        templateUrl: 'main/main.tpl.html',
        controller: 'MainController'
      });
  })
  .controller('MainController', function ($state) {
    $state.transitionTo('myApp.main.note');
  })

  .controller('linkController', function($scope, linkService){
    linkService.all().success(function(data, status){
      console.log('before sorting: ', data);
      $scope.restaurants = data;
    });
  })

  .factory('linkService', function($http){
    var all = function() {
      return $http({
        method:'GET',
        url:'http://localhost:4568/restaurant'
      });
    };

    var add = function(url){
      console.log('post url :', url);
      return $http({
        method:'POST',
        url:'http://localhost:4568/add',
        data: {'url': url}
      });
    };

    return {
      all: all,
      add: add
    };
  });

}(angular));
