'use strict';

var ptFilters = angular.module('pageTemplateFilters', []);


ptFilters.filter('startFrom', function() {
    return function(input, start) {
        start = +start;
        return input.slice(start);
    };
});