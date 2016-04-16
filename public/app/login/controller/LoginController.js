'use strict';
reachApp.controller('loginController', ['$scope', '$http', '$window', '$rootScope', 'loginService', 'store', 'noty', '$modal', function ($scope, $http, $window, $rootScope, loginService, store, noty, $modal) {

    //On controller Loaded
    $scope.init = function () {
        //Whenever redirected to Login remove the authtoken from localstorage
        store.remove('authtoken');
    };
    $scope.noty = noty; // notify service

    $scope.clearsignIn = function () {
        $scope.username = "";
        $scope.password = "";
    }

    //Event on Signin button click
    $scope.signIn = function () {  
        var $scope = this; 
        if ($scope.LoginForm.$valid) {
            var request = {};
            request.Username = $scope.username;
            request.Password = $scope.password;
            request.Role = $rootScope.vmuisettings.adminrolecode;
            //$window.location.href = '#/dashboard';
            loginService.accountSignIn(request).then(function (res) {
                if (res != null) {
                    //Set Auth token to local storage
                    if (res.token != undefined) {
                        var authTokenFromLocalStorage = store.get('authtoken');
                        if (authTokenFromLocalStorage == null) {
                            store.set('authtoken', res.token);
                        }
                        else {
                            store.remove('authtoken');
                            store.set('authtoken', res.token);
                        }
                    }
                    if (res.UserDetailsViewModel != undefined) {
                        //Set localstorage of logged on user details
                        store.set('loggedonuser', res.UserDetailsViewModel);
                        //$rootScope.$broadcast('menutoggled', angular.element("#wrapper").hasClass('toggled'));
                        //Redirect to dashboard Page
                        $window.location.href = '#/checkbox';
                    }
                    else {
                       
                        $window.href = "/";
                        noty.add({ type: 'danger', body: res.Message });
                    }
                }
                else {
                    console.log('In LoginController - LoginService data.success is false ie: Not a valid credentials');
                    $window.href = "/";
                }
            }, function (error) {
                // promise rejected, could log the error with: console.log('error', error);
                console.log('In LoginController - LoginService Error:', error);
                $window.href = "/";
            });
        }
    };

    $scope.open = function (size) { 

        var modalInstance = $modal.open({
            templateUrl: 'forgotPasswrdModalContent.html',
            controller: 'ModalInstanceCtrl',
            size: size,
            backdrop: 'static',
            resolve: {
                items: function () {
                    return $scope.items;
                }
            }
        });
    }

    $scope.SendForgotPwdMail = function (obj) {
        if ($scope.Forgotpasswordform.$valid) {
            var request = {};
            request.email = obj.Email == undefined ? "" : obj.Email;
            loginService.ForgotPassword(request).then(function (res) {
                if (res.Success) {
                    $scope.cancel();
                    noty.add({ type: 'success', body: res.Message });
                }
                else {
                    $scope.cancel();
                    noty.add({ type: 'danger', body: res.Message });
                }
            });
        }
    }

} ]);