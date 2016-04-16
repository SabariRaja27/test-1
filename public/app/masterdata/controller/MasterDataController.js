/**
Controller Associated to bind master data
master table data will be fetched and set to the scope
*/
'use strict';
reachApp.controller('masterDataController', ['$scope', 'masterDataService', '$window', '$timeout', '$rootScope', function ($scope, masterDataService, $window, $timeout, $rootScope) {

    var findAllMasters = function () {
        masterDataService.findAllMasters().then(function (res) {
            $scope.Masters = res;
            angular.forEach(res, function (item, key) {
                //broadcast the master with its items to store in the local storage
                $rootScope.$broadcast(key + "_OnLoadSuccess", item);
            });
        });
    }

    var yearsFordropdown = function () {
        var year = new Date().getFullYear();
        var range = [];
        range.push(year);
        for (var i = 1; i < 20; i++) {
            var obj = {};
            obj.name = year - i;
            obj.value = year - i;
            range.push(obj);
        }
        $scope.years = range;
    }

    findAllMasters();
    yearsFordropdown();
} ]);