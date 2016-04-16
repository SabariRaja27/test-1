'use strict';
reachApp.factory('userservice', ['$window', '$http', '$q', '$rootScope', function ($window, $http, $q, $rootScope) {
    return {
        SaveUser: function (req, Id, MethodType) {
            var deferred = $q.defer(); //promise
            var URL = $rootScope.vmuisettings.PROTONAPIURL + 'api/user/' + Id;

            var jsonData = JSON.stringify(req);
            $http({ method: MethodType, url: URL, data: jsonData, headers: { 'contentType': 'application/json' } }).
                success(function (data, status, headers) {
                    deferred.resolve(data);
                }).
                error(function (data, status, headers) {
                    deferred.reject(status);
                });
            return deferred.promise;
        },
        GetDocument: function (req) {
            var deferred = $q.defer(); //promise
            var URL = $rootScope.vmuisettings.PROTONAPIURL + 'api/Documents/0';

            var jsonData = req;
            $http({ method: 'POST', url: URL, data: jsonData, headers: { 'contentType': 'application/json' } }).
                success(function (data, status, headers) {
                    deferred.resolve(data);
                }).
                error(function (data, status, headers) {
                    deferred.reject(status);
                });
            return deferred.promise;
        },
        SaveAddress: function (req, MethodType) {
            var deferred = $q.defer(); //promise
            var URL = $rootScope.vmuisettings.PROTONAPIURL + 'api/address';

            var jsonData = req;
            $http({ method: MethodType, url: URL, data: jsonData, headers: { 'contentType': 'application/json' } }).
                success(function (data, status, headers) {
                    deferred.resolve(data);
                }).
                error(function (data, status, headers) {
                    deferred.reject(status);
                });
            return deferred.promise;
        },
        GetAddressforUser: function (id) {
            var deferred = $q.defer(); //promise
            var URL = $rootScope.vmuisettings.PROTONAPIURL + 'api/address/' + id;
            
            $http({ method: "GET", url: URL, headers: { 'contentType': 'application/json' } }).
                success(function (data, status, headers) {
                    deferred.resolve(data);
                }).
                error(function (data, status, headers) {
                    deferred.reject(status);
                });
            return deferred.promise;
        },
        GetUser: function (UserCode) {
            var deferred = $q.defer(); //promise
            var URL = $rootScope.vmuisettings.PROTONAPIURL + 'api/user/' + UserCode;
            $http({ method: 'GET', url: URL }).
                success(function (data, status, headers, config) {
                    deferred.resolve(data);
                }).
                error(function (data, status, headers, config) {
                    deferred.reject(status);
                });
            return deferred.promise;
        },
        SearchUser: function (req) {
            var deferred = $q.defer(); //promise
            var URL = $rootScope.vmuisettings.PROTONAPIURL + 'api/user/search';

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
}])