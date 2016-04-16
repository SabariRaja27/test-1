'use strict';
//http://plnkr.co/edit/octwC4BCuXLmRhHgLD8T?p=preview
reachApp.directive('uiSelectRequired', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attrs, ngModelCtrl) {
            if (angular.isUndefined(attrs.multiple)) {
                return;
            }
            ngModelCtrl.$isEmpty = function (modelValue) {
                //   return !modelValue.length;
                return (modelValue.length == 0) ? true : false;
            };
        }
    };
});