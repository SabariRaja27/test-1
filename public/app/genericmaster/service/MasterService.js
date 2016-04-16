'use strict';
reachApp.factory('masterservice', ['$window', '$http', '$q',function ($window, $http, $q) {
    return {
        SaveData: function (req, URL, MethodType) {
            var deferred = $q.defer(); //promise
            var jsonData =  req;
            $http({ method: MethodType, url: URL, data: jsonData, headers: { 'contentType': 'application/json'} }).
                success(function (data, status, headers) {
                    deferred.resolve(data);
                }).
                error(function (data, status, headers) {
                    deferred.reject(status);
                });
            return deferred.promise;
        }
    }
}])