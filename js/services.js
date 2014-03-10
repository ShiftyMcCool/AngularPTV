'use strict';

var ptServices = angular.module('pageTemplateServices',[]);

ptServices.factory('portfolio', function($http){
  return {
    getPortfolio: function($scope) {
      return $http.get($scope.dataSourceUrl + '/get', {
        //return $http.get('/xml/PageTemplatePortfolio.xml', {
        transformResponse:function(data) {
          var x2js = new X2JS();
          var json = x2js.xml_str2json( data ).portfolio.pagetemplate;
          return json;
        }
      });
    },
    getPageTemplate: function($scope,id) {
      angular.forEach($scope.portfolio, function(value, key){
        if(value.id == id){
          $scope.ptIndex = key;
          $scope.thisTemplate = angular.copy($scope.portfolio[key]);
        }
      });
    },
    addPageTemplate: function($scope,index) {
      $scope.portfolio.push({
        id:$scope.thisTemplate.id, 
        title:$scope.thisTemplate.title,
        description:$scope.thisTemplate.description,
        cost:$scope.thisTemplate.cost,
        smallpic:$scope.thisTemplate.smallpic,
        largepic:$scope.thisTemplate.largepic
      });

      this.persistData($scope);
    },
    updatePageTemplate: function($scope,index) {
      $scope.portfolio[index] = $scope.thisTemplate;
      $scope.thisTemplate = "";

      this.persistData($scope);
    },
    deletePageTemplate: function($scope,index) {
      $scope.portfolio.splice(index,1);

      this.persistData($scope);
    },
    persistData: function($scope) {
      var x2js = new X2JS();
      var xmlCopy = angular.copy($scope.portfolio);
      var xml = '<portfolio>';

      for(var x in $scope.portfolio) {
        xml += '<pagetemplate>'
        
        xml += x2js.json2xml_str(xmlCopy[x]);

        xml += '</pagetemplate>'
      }

      xml += '</portfolio>'

      $http.post($scope.dataSourceUrl + '/save?portfolio=' + xml);
    }
  };
});