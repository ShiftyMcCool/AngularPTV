var app=angular.module('myApp', ['ngRoute'],
  function($routeProvider) {
    $routeProvider
    .when('/', {
      templateUrl:'/views/detail.html'
    })
    .when('/detail/:pageTemplateID', {
      controller:'DetailController',
      templateUrl:'/views/detail.html'
    })
    .when('/edit/:pageTemplateID', {
      controller:'EditController',
      templateUrl:'/views/edit.html'
    })
    .when('/new', {
      controller:'CreateController',
      templateUrl:'/views/edit.html'
    })
    .otherwise({
      redirectTo:'/'
    });
});

app.factory('portfolio', function($http){
  return {
    getPortfolio: function() {
      return $http.get('/xml/PageTemplatePortfolio.xml', {
        transformResponse:function(data) {
          var x2js = new X2JS();
          var json = x2js.xml_str2json( data ).portfolio.pagetemplate;
          console.log(json);
          return json;
        }
      });
    },
    setPageData: function($scope,id) {
      angular.forEach($scope.portfolio, function(value, key){
        if(value.id == id){
          $scope.ptIndex = key;
          $scope.id = value.id;
          $scope.title = value.title;
          $scope.description = value.description;
          $scope.cost = value.cost;
          $scope.smallpic = value.smallpic;
          $scope.largepic = value.largepic;
        }
      });
    }
  };
});

app.controller('PageTemplateController', function($scope,$route,$location,portfolio) {
  $scope.portfolio = [];

  var handleSuccess = function(data, status) {
    $scope.portfolio = data;
    $scope.id = data[0].id;
    $scope.title = data[0].title;
    $scope.description = data[0].description;
    $scope.cost = data[0].cost;
    $scope.smallpic = data[0].smallpic;
    $scope.largepic = data[0].largepic;
    $scope.currentPage = 0;
    $scope.pageSize = 4;
  };

  portfolio.getPortfolio().success(handleSuccess);

  $scope.prevEnabled = function() {
    if($scope.currentPage == 0) {
      $scope.prevClass = 'page-button-disabled';
      return true;
    }
    else {
      $scope.prevClass = 'page-button';
      return false;
    }
  };

  $scope.nextEnabled = function() {
    if($scope.currentPage >= $scope.portfolio.length/$scope.pageSize - 1) {
      $scope.nextClass = 'page-button-disabled';
      return true;
    }
    else {
      $scope.nextClass = 'page-button';
      return false;
    }
  };

  $scope.go = function ( path,id ) {
    if(typeof id != 'undefined') {
      path = path+id;
    } 

    $location.path( path );
  };
});

app.controller('DetailController', function($scope,$routeParams,portfolio) {
  portfolio.setPageData($scope,$routeParams.pageTemplateID);
});

app.controller('EditController', function($scope,$routeParams,$location,portfolio) {
  portfolio.setPageData($scope,$routeParams.pageTemplateID);

  var ptIndex = $scope.ptIndex;
  
  $scope.editPageTemplate = function() {
    $scope.portfolio[ptIndex].id = $scope.id;
    $scope.portfolio[ptIndex].title = $scope.title;
    $scope.portfolio[ptIndex].description = $scope.description;
    $scope.portfolio[ptIndex].cost = $scope.cost;
    $scope.portfolio[ptIndex].smallpic = $scope.smallpic;
    $scope.portfolio[ptIndex].largepic = $scope.largepic;

    $location.path('/detail/'+$scope.id);
  };
});

app.controller('CreateController', function($scope) {
 $scope.addPageTemplate = function() {
    $scope.portfolio.push({
      id:$scope.id, 
      title:$scope.title,
      description:$scope.description,
      cost:$scope.cost,
      smallpic:$scope.smallpic,
      largepic:$scope.largepic
    });

    $location.path('/detail/'+$scope.id);
  };
});

app.filter('startFrom', function() {
    return function(input, start) {
        start = +start;
        return input.slice(start);
    };
});