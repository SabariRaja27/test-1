'use strict';
reachApp.factory('masterDataService', ['$http', '$q',function ($http, $q) {
    return {

        findAllHubs: function () {
            var deferred = $q.defer(); //promise
            $http({ method: 'GET', url: 'data/ehc-data.json' }).
                success(function (data, status, headers, config) {
                    //console.log(data)
                    deferred.resolve(data.Hubs);
                }).
                error(function (data, status, headers, config) {
                    deferred.reject(status);
                });
            return deferred.promise;
        },

        findAllTicketTypes: function () {
            var deferred = $q.defer(); //promise
            $http({ method: 'GET', url: 'data/dropdown-data.json' }).
                success(function (data, status, headers, config) {
                    //console.log(data)
                    deferred.resolve(data.TicketTypes);
                }).
                error(function (data, status, headers, config) {
                    deferred.reject(status);
                });
            return deferred.promise;
        },

        findAllPriorities: function () {
            var deferred = $q.defer(); //promise
            $http({ method: 'GET', url: 'data/dropdown-data.json' }).
            success(function (data, status, headers, config) {
                deferred.resolve(data.Priorities);
            }).
            error(function (data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        },

        findAllRequestors: function () {
            var deferred = $q.defer(); //promise
            $http({ method: 'GET', url: 'data/dropdown-data.json' }).
                success(function (data, status, headers, config) {
                    deferred.resolve(data.Requestors);
                }).
                error(function (data, status, headers, config) {
                    deferred.reject(status);
                });
            return deferred.promise;
        },
        findAllHoldingDataStatus: function () {
            var deferred = $q.defer(); //promise
            $http({ method: 'GET', url: 'data/dropdown-data.json' }).
                success(function (data, status, headers, config) {
                    deferred.resolve(data.HoldingDataStatus);
                }).
                error(function (data, status, headers, config) {
                    deferred.reject(status);
                });
            return deferred.promise;
        },
        findAlllllness: function () {
            var deferred = $q.defer(); //promise
            $http({ method: 'GET', url: 'data/dropdown-data.json' }).
                success(function (data, status, headers, config) {
                    deferred.resolve(data.Illness);
                }).
                error(function (data, status, headers, config) {
                    deferred.reject(status);
                });
            return deferred.promise;
        },
        findAllCustomer: function () {
            var deferred = $q.defer(); //promise
            $http({ method: 'GET', url: 'data/dropdown-data.json' }).
                success(function (data, status, headers, config) {
                    deferred.resolve(data.Customer);
                }).
                error(function (data, status, headers, config) {
                    deferred.reject(status);
                });
            return deferred.promise;
        },
        findAllState: function () {
            var deferred = $q.defer(); //promise
            $http({ method: 'GET', url: 'data/dropdown-data.json' }).
                success(function (data, status, headers, config) {
                    deferred.resolve(data.State);
                }).
                error(function (data, status, headers, config) {
                    deferred.reject(status);
                });
            return deferred.promise;
        },
        findAllCity: function () {
            var deferred = $q.defer(); //promise
            $http({ method: 'GET', url: 'data/dropdown-data.json' }).
                success(function (data, status, headers, config) {
                    deferred.resolve(data.City);
                }).
                error(function (data, status, headers, config) {
                    deferred.reject(status);
                });
            return deferred.promise;
        },
        findAllCoolerCode: function () {
            var deferred = $q.defer(); //promise
            $http({ method: 'GET', url: 'data/dropdown-data.json' }).
                success(function (data, status, headers, config) {
                    deferred.resolve(data.CoolerCode);
                }).
                error(function (data, status, headers, config) {
                    deferred.reject(status);
                });
            return deferred.promise;
        },
        findAllCarrier: function () {
            var deferred = $q.defer(); //promise
            $http({ method: 'GET', url: 'data/dropdown-data.json' }).
                success(function (data, status, headers, config) {
                    deferred.resolve(data.Carrier);
                }).
                error(function (data, status, headers, config) {
                    deferred.reject(status);
                });
            return deferred.promise;
        }
    }
}])