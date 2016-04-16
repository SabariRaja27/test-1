'use strict';
reachApp.directive('mySample', ['$compile', function ($compile) {
    return {
        link: function (scope, element, attrs, controller) {
            var markup = "<input type='text' ng-model='sampleData'/> {{sampleData}}</br>";
            angular.element(element).html($compile(markup)(scope));
        }
    };
}]);