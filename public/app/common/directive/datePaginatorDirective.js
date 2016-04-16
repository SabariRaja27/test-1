/*
Author : Paulomi
Date Created: 16-March-2015
Description: Angularjs  date paginator 
*/

'use strict';
reachApp.directive('datePagination', ['$timeout', '$rootScope',function ($timeout, $rootScope) {
    return {
        restrict: 'E', /* restrict this directive to elements */
        template: 'app/common/view/directiveTemplates/datepaginator/datepaginator.html',
        scope: {
            controlId: '@',
            startDate: '@',
            endDate: '@'     // -> '@' will pass the value of the attribute whose name matches angular camelCase convention i.e. -
        },
        link: function (scope, element, attrs, controller) {
            console.log(attrs.controlId);
            console.log(attrs.startDate);
            console.log(attrs.endDate);
            var options = {
                size: "small",
                startDate: attrs.startDate,
                endDate: attrs.endDate,
                //selectedDate: attrs.startDate,
                onSelectedDateChanged: function (event, date) {
                    //alert("Selected date: " + moment(date).format("Do, MMM YYYY"));
                    $rootScope.$emit('on' + attrs.controlId + 'Select', moment(date).format('YYYY-MM-DD'));
                }
            }
            $timeout(function () {
                angular.element(element).datepaginator(options);
                 $rootScope.$emit('on' + attrs.controlId + 'Load', options);
            }, 0);
        }
    };
}]);




