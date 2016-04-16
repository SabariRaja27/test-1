/**
Service to get master data
Getting data from the json
*/
'use strict';
reachApp.factory('masterDataService', ['$http', '$q',function ($http, $q) {
    return {

        findAllMasters: function () {
            var deferred = $q.defer(); //promise
            $http({ method: 'GET', url: 'data/dropdown-data.json' }).
                success(function (data, status, headers, config) {
                    deferred.resolve(data);
                }).
                error(function (data, status, headers, config) {
                    deferred.reject(status);
                });
            return deferred.promise;
        }
    }
}])