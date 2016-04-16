'use strict';
reachApp.controller('mainController', ['$rootScope', '$scope', '$location', '$timeout', 'noty', 'breadcrumbs', 'underscore', 'store', 'navbarService', 'DashboardService', function ($rootScope, $scope, $location, $timeout, noty, breadcrumbs, _, store, navbarService, DashboardService) {
    $scope.navVisible = true;
    $scope.breadcrumbs = breadcrumbs;
    $scope.noty = noty;
    //http://stackoverflow.com/questions/21715256/angularjs-event-to-call-after-content-is-loaded
    $scope.ParseJSON = function (obj) {
        var result = JSON.parse(obj);
        return result;
    }
    $scope.$on('$viewContentLoaded', function (args, item) {
        //To clear the $rootScope.Allfiles if any routes are changed
        $rootScope.Allfiles = [];
        //  console.log("Loaded View = [ " + $location.path() + "]");
        $timeout(function () { $rootScope.$broadcast('view-changed', { "view": $location.path() }) }, 200);
        //default setting for page
        $scope.footerVisible = false;
        angular.element("#div_maincontainer").addClass("container-custom");
        $scope.navLoginVisible = false;
        $scope.navVisible = false;
        $scope.layoutClass = "container-fluid ";
        $scope.breadcrumbClass = "ab-nav breadcrumb";
        $scope.customBreadcrumbClass = "customBreadcrumb";
        $.backstretch(["app/img/Background/white.png"]);
        if ($location.path() == '/login') {
            $.backstretch(["app/img/Background/Background.png"]);
            $scope.footerVisible = true;
            angular.element("#div_maincontainer").removeClass("container");
            $scope.navLoginVisible = true;
            $scope.layoutClass = "";
            $scope.breadcrumbClass = "ng-hide";
            $scope.customBreadcrumbClass = "ng-hide";
        }
        else {
            $scope.navVisible = true;
        }
        //Added condition to show breadcrumb except for login page
        if ($location.path() != '/login') {
            // Will replace the default label  with the dynamic label 
           breadcrumbs.options = { 'dashboard': 'Dashboard','user':'User','ROLE':'Role', 'category':'Category','subcategory':'Sub Category','servicetype':'Service Type','option':'Option','serviceprice': 'Service Price','order':'Order','location':'Location','serviceprovider':'Service Provider','timeslot':'Time Slot', 'rating': 'Rating','configuration':'Configuration' };
            $scope.breadcrumbs = breadcrumbs;
        }
        //For profile picture - starts
        var loggedonuserinfo = store.get('loggedonuser');
        if (null != loggedonuserinfo) {            
            var LoadProfilepicture = function () {
                $rootScope.profilepicpresent = false;
                if (loggedonuserinfo.DocumentCode != undefined && loggedonuserinfo.DocumentCode != "0")
                {
                    //call navbarservice and get profile picture
                    navbarService.RenderDocument(loggedonuserinfo.DocumentCode).then(function (res) {
                        if (res.Success) {
                            if (res != null) {
                                //If result is not null set base 64 image
                                $rootScope.profilepicpresent = true;
                                $rootScope.userProfileImage = 'data:' + res.ContentType + ';base64,' + res.Base64Model.Image;
                            }
                        }
                    });
                }
                //var request = {};
                //request.RequestCode = loggedonuserinfo.Code;
                //request.RequestType = "User";
                //navbarService.GetDocument(request).then(function (res) {debugger
                //    if (res.aaData.Success && res.aaData.DocumentDetails.length > 0) {
                //        $rootScope.profilepicpresent = true;
                //        $rootScope.userProfileImage = 'data:' + res.aaData.DocumentDetails[0].ContentType + ';base64,' + res.aaData.DocumentDetails[0].Base64File;
                //    }
                //});
            }
            $timeout(function () { LoadProfilepicture(); }, 50);
            $rootScope.$on('profilepicture_uploaded', function (e, i) {
                if (i == loggedonuserinfo.Code) {
                    LoadProfilepicture();
                }
            });            
        }
        //For profile picture - ends
        if (null != loggedonuserinfo) {
            //For open order count
            //DashboardService.GetDetails().then(function (res) {
            //    if (res.Success) {
            //        if (res.ViewModels.length > 0) {
            //            var openorders = _.filter(res.ViewModels, function (o) {
            //                return (o.OrderStatusCode == $rootScope.vmuisettings.OpenOrderStatusCode && o.Status == true && o.PaymentStatusCode != $rootScope.vmuisettings.PendingPaymentStatusCode && o.PaymentStatusCode != $rootScope.vmuisettings.FailedPaymentStatusCode);
            //            });
            //            $scope.OpenOrderscount = openorders.length;
            //        }
            //    }
            //});
        }
    });

    $scope.menuclicked = function () {
        $scope.myStyle = { display: 'none' };

    }

    //function to get the parent menu for breadcrumb
    $scope.GetParentMenu = function (args) {
        if ($rootScope.Menu != undefined) {
            var ParentMenu = "";
            _.each($rootScope.Menu, function (item) {
                _.each(item.SubMenus, function (submenu) {
                    if (submenu.Url.substring(1) == $location.path().split('/')[1]) {
                        ParentMenu = submenu;
                    }
                });
            });
            return (ParentMenu == "" ? "" : (ParentMenu.Parent + " / "));
        }
    }

    $rootScope.$$listeners.showLoadProgressBar = [];
    $rootScope.$on('showLoadProgressBar', function (i, o) {
        if (o.progress == 'show') {
            angular.element('#' + o.container).html("");
            angular.element('#' + o.container).append('<div class="customLoaderMsg  well-transparent" style="font-size:17px;"><center><i class="fa fa-spinner fa fa-spin fa fa-lg"></i></center>&nbsp;</div>');
        }
        else {
            angular.element('#' + o.container).find(".customLoaderMsg").remove();
        }
    });

} ])