'use strict';
reachApp.factory('documentService', ['$http', '$q', '$rootScope', function ($http, $q, $rootScope) {
    return {
        DeleteDocument: function (req) {
            var deferred = $q.defer(); //promise
            var URL = $rootScope.vmuisettings.PROTONAPIURL + 'api/DeleteDocument';
            var jsonData = req;
            $http({ method: 'POST', url: URL, data: jsonData, headers: { 'contentType': 'application/json' } }).
                success(function (data, status, headers) {
                    deferred.resolve(data);
                }).
                error(function (data, status, headers) {
                    deferred.reject(status);
                });
            return deferred.promise;
        }
    }
}]);