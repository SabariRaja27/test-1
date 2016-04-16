reachApp.factory('loginService', ['$http', '$q', '$rootScope', function ($http, $q, $rootScope) {
    return {
        accountSignIn: function (req) {
            // the $http API is based on the deferred/promise APIs exposed by the $q service
            // so it returns a promise for us by default
            //return $http({
            //    url: "http://localhost:50726/api/account/Authenticate",
            //    method: "POST",
            //    data: { request: req },
            //    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
            //}).then(function (response) {
            //    if (typeof response.data === 'object') {
            //        return response.data;
            //    } else {
            //        // invalid response
            //        return $q.reject(response.data);
            //    }

            //}, function (response) {
            //    // something went wrong
            //    return $q.reject(response.data);
            //});

            var deferred = $q.defer(); //promise
            $http({
                method: 'POST',
                url: $rootScope.vmuisettings.PROTONAPIURL + 'api/account/Authenticate',
                data: req,
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
            }).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        },

        //ForgotPassword: function (req) { debugger
        //    // the $http API is based on the deferred/promise APIs exposed by the $q service
        //    // so it returns a promise for us by default
        //    return $http({
        //        url: $rootScope.vmuisettings.PROTONAPIURL + 'api/account/forgotpassword',
        //        method: "POST",
        //        data:  req ,
        //        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
        //    }).then(function (response) {debugger
        //        if (typeof response.data === 'object') {
        //            return response.data;
        //        } else {
        //            // invalid response
        //            return $q.reject(response.data);
        //        }

        //    }, function (response) {
        //        // something went wrong
        //        return $q.reject(response.data);
        //    });
        //}

        ForgotPassword: function (req) { 
            // the $http API is based on the deferred/promise APIs exposed by the $q service
            // so it returns a promise for us by default
            var deferred = $q.defer(); //promise
            $http({
                method: 'POST',
                url: $rootScope.vmuisettings.PROTONAPIURL + 'api/account/forgotpassword',
                data: req,
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
            }).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        }
    };
}]);