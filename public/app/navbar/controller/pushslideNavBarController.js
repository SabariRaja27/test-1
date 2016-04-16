/**
Controller Associated to a Navbar
View Changed event tracked to set Logged on user and User roles
*/
'use strict';
reachApp.controller('pushSlideNavBarController', ['$rootScope', '$scope', '$location', '$modal', '$log', '$window', 'store', 'navbarService', '$timeout', 'underscore', function ($rootScope, $scope, $location, $modal, $log, $window, store, navbarService, $timeout, _) {
    $scope.showIconMenu = true;
    
    //$scope.$on('menutoggled', function (e, i) {
    //    $scope.$apply(function () {
    //        $scope.showIconMenu = i;
    //    });
    //});

    $scope.LoggedOnUserName = "";
    $scope.LoggedOnUserRole = "";
    $scope.noop = function () {
        console.log("noop")
        angular.noop();
    };

    $scope.isActive = function (menu) {
        if (menu != "") {
            var item = JSON.parse(menu);
            var ParentMenu = "";
            if (item.SubMenus.length > 0) {
                ParentMenu = _.filter(item.SubMenus, function (submenu) {
                    return submenu.Url.substring(1) == $location.path().split('/')[1];
                });
            }
            var IsParentExsists = ParentMenu.length == 1 ? true : false;
            return ((item.Url.substring(1) == $location.path().split('/')[1]) || IsParentExsists);
        }
    };

    //Initiating nav url on page load - Starts
    $scope.InitiateMenu = function () {
        $scope.nav = {};
        //Start initiation after menu json is loaded
        $scope.$on('menu_Loaded', function (e, menu) {
            //for each menu check the url selected
            angular.forEach(menu, function (data) {
                //For Parent Nav level
                if (data.SubMenus.length == 0) {
                    if (data.Url == $location.$$path) {
                        $scope.nav.navType = $location.$$path;
                        $scope.nav.subnavType = $location.$$path;
                        return true;
                    }
                }
                    //For Child nav level
                else {
                    angular.forEach(data.SubMenus, function (submenu) {
                        if (submenu.Url == $location.$$path) {
                            $scope.nav.navType = data.Url;
                            $scope.nav.subnavType = $location.$$path;
                            return true;
                        }
                    });
                }
            });
        });
    }

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

        var loggedonuserinfo = store.get('loggedonuser');
        if (null != loggedonuserinfo) {
            $scope.LoggedOnUserName = loggedonuserinfo.FirstName;
            $scope.LoggedOnUserRole = loggedonuserinfo.Role;

            //Restricting user based on rolecode and localstorage - Starts
            //Role Code : Admin:N2SF2T , User:GKLEPP , Super User:UV2I5H
            if ($scope.LoggedOnUserRole != "") {
                var allowUser = false;
                if ($scope.Menu != null) {
                    var url = $location.path();
                    angular.forEach($scope.Menu, function (menu) {
                        //PrivilegedRoleCodes
                        if (menu.SubMenus.length > 0) {
                            angular.forEach(menu.SubMenus, function (submenu) {
                                if (submenu.Url == url) {
                                    if (submenu.PrivilegedRoleCodes != null) {
                                        var roles = submenu.PrivilegedRoleCodes.split(',');
                                        angular.forEach(roles, function (role) {
                                            if ($scope.LoggedOnUserRole != null) {
                                                var loggedonroles = $scope.LoggedOnUserRole.split(',');
                                                angular.forEach(loggedonroles, function (loggedonrole) {
                                                    if (role == loggedonrole) {
                                                        allowUser = true;
                                                    }
                                                });
                                            }
                                        });
                                    }
                                    else {
                                        allowUser = true;
                                    }
                                }
                            });
                        }
                        else {
                            if (menu.Url == url) {
                                if (menu.PrivilegedRoleCodes != null) {
                                    var roles = menu.PrivilegedRoleCodes.split(',');
                                    angular.forEach(roles, function (role) {
                                        if ($scope.LoggedOnUserRole != null) {
                                            var loggedonroles = $scope.LoggedOnUserRole.split(',');
                                            angular.forEach(loggedonroles, function (loggedonrole) {
                                                if (role == loggedonrole) {
                                                    allowUser = true;
                                                }
                                            });
                                        }
                                    });
                                }
                                else {
                                    allowUser = true;
                                }
                            }
                        }
                    });
                }
                if ($location.url().indexOf("mode=View")) {
                    allowUser = true;
                }
                if ($location.path() == '/404') {
                    allowUser = true;
                }

                if (!allowUser) {
                    $window.location.href = "/dashboard"
                }

                if ($scope.LoggedOnUserRole == $rootScope.vmuisettings.adminrolecode) {
                    angular.element('#FeedCount').removeClass("hide");
                }               
            }
            else {
                $window.location.href = "/login"
            }
            //Restricting user based on rolecode and localstorage - Ends
        }
    });
} ]);
