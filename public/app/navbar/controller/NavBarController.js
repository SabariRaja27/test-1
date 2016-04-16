/**
Controller Associated to a Navbar
View Changed event tracked to set Logged on user and User roles
*/
'use strict';
reachApp.controller('navBarController', ['$rootScope', '$scope', '$location', '$modal', '$log', '$window', 'store', 'navbarService', '$timeout', 'underscore','noty', function ($rootScope, $scope, $location, $modal, $log, $window, store, navbarService, $timeout, _, noty) {

    //$scope.$on('menutoggled', function (e, i) {
    //    $scope.$apply(function () {
    //        $scope.showIconMenu = i;
    //    });
    //});

    //angular.element("#menu-toggle").click(function (e) {
    //    e.preventDefault();
    //    angular.element("#wrapper").toggleClass("toggled");
    //    $rootScope.$broadcast('menutoggled', angular.element("#wrapper").hasClass('toggled'));
    //});

    $window.onresize = function (e) {
        $scope.resizewidth = e.target.innerWidth;
        ShoworHideSignOutText(e.target.innerWidth);
    };

    function ShoworHideSignOutText(width) {
        if (width < 450) {
            angular.element("#spnSignOut").addClass("ng-hide");
        } else {
            angular.element("#spnSignOut").removeClass("ng-hide");
        }
    }

    $scope.LoggedOnUserName = "";
    $scope.LoggedOnUserEmail = "";
    $scope.LoggedOnUserRole = "";
    $scope.LoggedOnUserCode = "";
    $scope.noop = function () {
        console.log("noop")
        angular.noop();
    };

        $scope.isActive = function (menu) {
            return menu == $location.path();
        };
    //$scope.isActive = function (menu) {
    //    if (menu != "") {
    //        var item = JSON.parse(menu);
    //        var ParentMenu = "";
    //        if (item.SubMenus.length > 0) {
    //            ParentMenu = _.filter(item.SubMenus, function (submenu) {
    //                return submenu.Url.substring(1) == $location.path().split('/')[1];
    //            });
    //        }
    //        var IsParentExsists = ParentMenu.length == 1 ? true : false;
    //        return ((item.Url.substring(1) == $location.path().split('/')[1]) || IsParentExsists);
    //    }
    //};

    var LoadMenuJSON = function () {
        navbarService.RendermenufrmJson().then(function (res) {

            $scope.MenuJSON = res.ViewModels;
            $rootScope.Menu = res.ViewModels;
        });
    }

    $timeout(function () { LoadMenuJSON(); }, 0);

    $rootScope.$on('view-changed', function (event, args) {
        //Restricting user based on rolecode and localstorage-Ranjan-start
        //Clearing the local storage if locationpath is login page
        if ($location.path() == '/login') {
            //To remove the slidermenu on signout if slidermenu is open
            //angular.element("#wrapper").addClass("toggled");
            store.remove('authtoken');
            store.remove('loggedonuser');
            store.remove('undefined');
            $scope.LoggedOnUserRole = "";
        }
        //$scope.active = "";
        ShoworHideSignOutText($window.innerWidth);
        var loggedonuserinfo = store.get('loggedonuser');
        if (null != loggedonuserinfo) {
            $scope.LoggedOnUserName = loggedonuserinfo.FirstName;
            $scope.LoggedOnUserEmail = loggedonuserinfo.Email;
            $scope.LoggedOnUserRole = loggedonuserinfo.Role;
            $scope.LoggedOnUserCode = loggedonuserinfo.Code;
        }
    });
    $scope.items = ['item1', 'item2', 'item3'];

    $scope.changepassword = function (size) {

        var modalInstance = $modal.open({
            templateUrl: 'myModalContent.html',
            controller: 'ModalInstanceCtrl',
            backdrop: 'static',
            size: size,
            resolve: {
                items: function () {
                    return $scope.items;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };

    //Popup to Applucation Version details - Starts
    $scope.openAboutUs = function (size) {
        navbarService.AssemblyInfo().then(function (res) {
            res.ApplicationName = "PROTON";
            res.ApplicationDescription = "PROTON";
            $rootScope.AssemblyInfo = res;
            var modalInstance = $modal.open({
                templateUrl: 'AssemblyInfo.html',
                controller: 'ModalInstanceCtrl',
                //size: size,
                resolve: {
                    items: function () {
                        return $rootScope.AssemblyInfo;
                    }
                }
            });
        });
    };
    //Popup to Applucation Version details - Ends

    $scope.ChangePassword = function (obj) {
        var loggedonuserinfo = store.get('loggedonuser');
        if ($scope.ChangePasswordform.$valid) {
                var request = {};
                request.OldPassword = obj.OldPassword;
                request.NewPassword = obj.NewPassword;
                var code = loggedonuserinfo.Code;
                var MethodType = "PUT";
                navbarService.ChangePassword(request,code,MethodType).then(function (res) {
                    if (res.Success) {
                        //To updated the localstorage with updated user details
                        //var userdetails = res.aaData.UserObj.UserDetailsViewModel;
                        //store.set('loggedonuser', userdetails);
                        $scope.cancel();
                        noty.add({ type: 'success', body: res.Message });
                        $window.location.href = "/";
                    }
                    else {
                        $scope.cancel();
                        noty.add({ type: 'danger', body: res.Message });
                    }
                });
        }
    }

}]);
