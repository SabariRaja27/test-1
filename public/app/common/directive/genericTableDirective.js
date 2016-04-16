/*
Author : Swathi
Date Created: 26-May-2015
Description: Generic Table Partial View
*/
'use strict';
reachApp.directive('vmGenericTable', ['$timeout', '$rootScope', function ($timeout, $rootScope) {
    return {
        restrict: 'E', /* restrict this directive to elements */
        templateUrl: 'app/common/view/directiveTemplates/table/table.html',
        scope: {
            controlId: '@',
            tableHeaderTemplate: '@',
            tableBodyTemplate: '@',
            sourceUrl: '@', // source url
            sourceObj: '@' // object from the result set

        },
        controller: ['$scope', '$http', '$compile', function ($scope, $http, $compile) {
            console.log("Table controller");

            //first Load Header 
            $http.get($scope.tableHeaderTemplate).then(function (res) {
                var elem = angular.element(res.data);
                var result = $compile(elem)($scope);
                angular.element("#tbl_" + $scope.controlId).append(result);

                // Then body template with data
                var promiseTableBody_template = $http.get($scope.tableBodyTemplate);
                if ($scope.sourceUrl != undefined) {
                    return $http({ method: 'GET', url: $scope.sourceUrl }).
                        success(function (data, status, headers, config) {
                            $scope.Data = data[$scope.sourceObj];
                            promiseTableBody_template.then(function (res) {
                                var elem = angular.element(res.data);
                                var result = $compile(elem)($scope);
                                angular.element(".tbl_" + $scope.controlId).find("tbody").append(result);
                            });
                        }).
                        error(function (data, status, headers, config) {
                            console.log("error retrieving details");
                        });
                }
            });
        }],
        link: function (scope, element, attrs, controller) {
            console.log(attrs.controlId);
            console.log(attrs.tableHeaderTemplate);
            console.log(attrs.tableBodyTemplate);

            element.bind('click', function (e) {
                if (angular.element(e.target).closest('a').hasClass("Edit")) {
                    //publish edit event with args
                    var rowobj = angular.element(e.target).closest('a').attr("data-row");
                    console.log(rowobj);
                    //publish the edit click event with row args 
                    $rootScope.$broadcast("tbl_" + attrs.controlId + "_EditClicked", rowobj);
                }
            });
        }
    };
}]);




