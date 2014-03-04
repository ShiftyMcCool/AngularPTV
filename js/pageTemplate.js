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
          $scope.thisTemplate = angular.copy($scope.portfolio[key]);
        }
      });
    }
  };
});

app.controller('PageTemplateController', function($scope,$route,$location,portfolio) {
  $scope.portfolio = [];
  $scope.ptIndex = 0;

  var handleSuccess = function(data, status) {
    $scope.portfolio = data;
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
    $scope.portfolio[ptIndex] = $scope.thisTemplate;
    $scope.thisTemplate = "";
    $scope.go('/detail/'+$scope.portfolio[ptIndex].id);
  };
});

app.controller('CreateController', function($scope) {
 $scope.addPageTemplate = function() {
    $scope.portfolio.push({
      id:$scope.portfolio[ptIndex].id, 
      title:$scope.portfolio[ptIndex].title,
      description:$scope.portfolio[ptIndex].description,
      cost:$scope.portfolio[ptIndex].cost,
      smallpic:$scope.portfolio[ptIndex].smallpic,
      largepic:$scope.portfolio[ptIndex].largepic
    });

    $location.path('/detail/'+$scope.portfolio[ptIndex].id);
  };
});

app.filter('startFrom', function() {
    return function(input, start) {
        start = +start;
        return input.slice(start);
    };
});