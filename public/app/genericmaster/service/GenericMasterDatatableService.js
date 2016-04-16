'use strict';
reachApp.factory('genericmasterdatatableservice', ['$window', '$http', '$q',function ($window, $http, $q) {
    return {
        findAll: function () {
            //'data/' + dataFileName[dataFileName.length-1] + '.js'
            var dataFileName = ($window.location.href).split('/');
            var deferred = $q.defer(); //promise
            $http({ method: 'GET', url: 'data/dropdown-data.json' }).
                success(function (data, status, headers, config) {
                    //console.log(data)
                    deferred.resolve(data);
                }).
                error(function (data, status, headers, config) {
                    deferred.reject(status);
                });
            return deferred.promise;
        }
    }
}])