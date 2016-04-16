'use strict';
//http://plnkr.co/edit/octwC4BCuXLmRhHgLD8T?p=preview
reachApp.directive('vmDatePicker', ['$rootScope', function ($rootScope) {
    return {
        restict: 'E',
        //replace : true, //-> this will not work in this case.
        scope: {
            ngDateSelected: '=',
            controlId: '@',
            controlName: '@',
            fieldRequired: '@'
        },
        templateUrl: 'app/common/view/directiveTemplates/datepicker/datepicker.html',

        link: function ($scope, element, attrs, controller) {
            $scope.openDatepicker = function ($event) {
                $event.preventDefault();
                $event.stopPropagation();
                $scope.opened = true;
            };
            $scope.dateOptions = {
                formatYear: 'yy',
                startingDay: 1
            };
            $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate', 'dd-MMM-yyyy'];
            $scope.format = $scope.formats[4];
            if (attrs.maximumdate != "" && attrs.maximumdate != undefined) {
                $scope.futureDate = attrs.maximumdate.substr(1, attrs.maximumdate.length - 2);
            }
            if (attrs.minimumdate != "" && attrs.minimumdate != undefined) {
                $scope.previousDate = attrs.minimumdate.substr(1, attrs.minimumdate.length - 2);
            }
            $scope.$watch('ngDateSelected', function () {
                $rootScope.$broadcast($scope.controlId + 'date_selected', $scope.ngDateSelected);
            });
        }
    };

} ]);