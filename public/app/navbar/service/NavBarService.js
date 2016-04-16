'use strict';
reachApp.factory('navbarService', ['$http', '$q','$rootScope', function ($http, $q,$rootScope) {
    return {
        RendermenufrmJson: function () {
            var deferred = $q.defer(); //promise
            $http({ method: 'GET', url: 'data/Menu.Json' }).
                success(function (data, status, headers, config) {
                    deferred.resolve(data);
                }).
                error(function (data, status, headers, config) {
                    deferred.reject(status);
                });
            return deferred.promise;
        },

        AssemblyInfo: function () {
            var deferred = $q.defer(); //promise
            $http({ method: 'GET', url: 'AssemblyInfo' }).
                success(function (data, status, headers, config) {
                    deferred.resolve(data.aaData);
                }).
                error(function (data, status, headers, config) {
                    deferred.reject(status);
                });
            return deferred.promise;
        },
        GetDocument: function (req) {
            var deferred = $q.defer(); //promise
            var URL = '/Documents/0';

            var jsonData = JSON.stringify({ 'request': req });
            $http({ method: 'POST', url: URL, data: jsonData, headers: { 'contentType': 'application/json' } }).
                success(function (data, status, headers) {
                    deferred.resolve(data);
                }).
                error(function (data, status, headers) {
                    deferred.reject(status);
                });
            return deferred.promise;
        },

        RenderDocument: function (docCode) {
            var deferred = $q.defer(); //promise
            $http({ method: 'GET', url: $rootScope.vmuisettings.PROTONAPIURL + 'api/RenderDocument/' + docCode }).
                success(function (data, status, headers, config) {
                    deferred.resolve(data);
                }).
                error(function (data, status, headers, config) {
                    deferred.reject(status);
                });
            return deferred.promise;
        },

        ChangePassword: function (req, Id, MethodType) {
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
    }
} ]);