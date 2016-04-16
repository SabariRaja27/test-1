'use strict';
reachApp.controller('dashboardController', ['$scope', '$http', '$window', '$rootScope', '$timeout', 'DashboardService', 'CategoryService', 'store', '$location', 'underscore', function ($scope, $http, $window, $rootScope, $timeout, DashboardService,CategoryService, store, $location, _) {
    
DashboardService.GetDashboardDetails().then(function (res) {
        if (res.Success) {
            var headers = _.uniq(_.pluck(res.ViewModels, 'CategoryName'));
            var headerscode = _.uniq(_.pluck(res.ViewModels, 'CategoryCode'));
            var head = [];
            for (var i = 0; i < headers.length; i++) {
                var header = {};
                header.label = headers[i];
                header.order = i;
                header.data = "Category_" + [i];
                head.push(header);
            }
            var first = {};
            first.label = "";
            first.data = "first";
            first.order = -1;
            head.push(first);
            var total = {};
            total.label = "Total";
            total.data = "Total";
            total.order = head.length + 1;
            head.push(total);
            $scope.headers = head;
         
            
            var body = _.groupBy(res.ViewModels, 'OrderMethod');
            var x = [];
            _.each(body, function (d, index) {
                var z = {};
                z.ordermethod = index;
                z.Total = 0;
                for (var i = 0; i < d.length; i++) {
                    var name2 = "Category" + (i + 1);
                    z[name2] = d[i].NoOfOrders;
                    z.Total += d[i].NoOfOrders;
                }
                x.push(z);
            });
            $scope.users = x;
        }
    });
    $scope.headerOrder = "order";



    DashboardService.GetDashboardDetailsForOrderStatus().then(function (res) {
        if (res.Success) {
            var headers = _.uniq(_.pluck(res.ViewModels, 'CategoryName'));
            var headerscode = _.uniq(_.pluck(res.ViewModels, 'CategoryCode'));
            var head = [];
            for (var i = 0; i < headers.length; i++) {
                var header = {};
                header.label = headers[i];
                header.order = i;
                header.data = "Category_" + [i];
                head.push(header);
            }
            var first = {};
            first.label = "";
            first.data = "first";
            first.order = -1;
            head.push(first);
            var total = {};
            total.label = "Total";
            total.data = "Total";
            total.order = head.length + 1;
            head.push(total);
            $scope.orderstatusheaders = head;
            var body = _.groupBy(res.ViewModels, 'OrderChartStatus');
            var x = [];
            _.each(body, function (d, index) {
                var z = {};
                z.orderstatus = index;
                z.Total = 0;
                for (var i = 0; i < d.length; i++) {
                    var name2 = "Category" + (i + 1);
                    z[name2] = d[i].NoOfOrders;
                    z.Total += d[i].NoOfOrders;
                }
                x.push(z);
            });
            $scope.orderstatusbody = x;
        }
    });


    DashboardService.GetDashboardDetailsForBookingarea().then(function (res) {
        if (res.Success) {
            var headers = _.uniq(_.pluck(res.ViewModels, 'CategoryName'));
            var headerscode = _.uniq(_.pluck(res.ViewModels, 'CategoryCode'));
            var head = [];
            for (var i = 0; i < headers.length; i++) {
                var header = {};
                header.label = headers[i];
                header.order = i;
                header.data = "Category" + [i];
                head.push(header);
            }
            var first = {};
            first.label = "";
            first.data = "first";
            first.order = -1;
            head.push(first);
            var total = {};
            total.label = "Total";
            total.data = "Total";
            total.order = head.length + 1;
            head.push(total);
            $scope.bookingorderstatusheaders = head;
            var onlycategoryheaders1 = _.filter($scope.bookingorderstatusheaders, function (o) { return o.data != "first" });
            var onlycategoryheaders = _.filter(onlycategoryheaders1, function (o) { return o.data != "Total" });
            var areas = _.filter(res.ViewModels, function (o) { return o.Area != "" });
            var body = _.groupBy(areas, 'Area');
            var x = [];
            _.each(body, function (d, index) {
                var z = {};
                z.bookingarea = index;
                z.Total = 0;
                for (i = 0; i < onlycategoryheaders.length; i++) {
                    var name2 = "Category" + (i + 1);
                    z[name2] = 0;
                }
                for (var i = 0; i < d.length; i++) {
                    var catorder = _.filter(onlycategoryheaders, function (o) { return o.label == d[i].CategoryName });
                    var name2 = (catorder[0].data).split("y")[0] + "y" + (parseInt((catorder[0].data).split("y")[1]) + 1);
                    z[name2] = d[i].NoOfOrders;
                    z.Total += d[i].NoOfOrders;
                }
                x.push(z);
            });
            var ordercountmorethanzero = _.filter(res.ViewModels, function (o) { return o.NoOfOrders > 0 });
            var onlycityorders = _.filter(ordercountmorethanzero, function (o) { return o.Area == "" });
            var body1 = _.groupBy(onlycityorders, 'CityName');
            _.each(body1, function (d, index) {
                var y = {};
                y.bookingarea = index;
                y.Total = 0;
                for (i = 0; i < onlycategoryheaders.length; i++) {
                    var name2 = "Category" + (i + 1);
                    y[name2] = 0;
                }
                for (var i = 0; i < d.length; i++) {
                    var catorder = _.filter(onlycategoryheaders, function (o) { return o.label == d[i].CategoryName });
                    var name2 = (catorder[0].data).split("y")[0] + "y" + (parseInt((catorder[0].data).split("y")[1]) + 1);
                    y[name2] = d[i].NoOfOrders;
                    y.Total += d[i].NoOfOrders;
                }
                x.push(y);
            });



            var z = _.sortBy(x, function (y) { return y.bookingarea });
            $scope.bookingareabody = z;

            $scope.totalItems = $scope.bookingareabody.length;
            $scope.currentPage = 1;
            $scope.numPerPage = 10;

            $scope.paginate = function (value) {
                var begin, end, index;
                begin = ($scope.currentPage - 1) * $scope.numPerPage;
                end = begin + $scope.numPerPage;
                index = $scope.bookingareabody.indexOf(value);
                return (begin <= index && index < end);
            };


        }
        else {
            angular.element("#bookingareadatatable").html("No records found");
        }
    });


    
    //DashboardService.GetDetails().then(function (res) {
    //    if (res.Success) {
    //        if (res.ViewModels.length > 0) {
    //            var totalorders = _.filter(res.ViewModels, function (o) {
    //                return (o.Status == true);
    //            });
    //            $scope.TotalOrders = totalorders.length;
    //            var pendingorders = _.filter(res.ViewModels, function (o) {
    //                return (o.OrderStatusCode == $rootScope.vmuisettings.PendingOrderStatusCode && o.Status == true);
    //            });
    //            $scope.PendingOrders = pendingorders.length;

    //            var openorders = _.filter(res.ViewModels, function (o) {
    //                return (o.OrderStatusCode == $rootScope.vmuisettings.OpenOrderStatusCode && o.Status == true);
    //            });
    //            $scope.OpenOrders = openorders.length;

    //        }
    //        else {
    //            $scope.TotalOrders = "0";
    //            $scope.PendingOrders = "0";
    //            $scope.OpenOrders = "0";
    //        }
    //    }
    //    else {
    //        $scope.TotalOrders = "0";
    //        $scope.PendingOrders = "0";
    //        $scope.OpenOrders = "0";
    //    }
    //});

}]);




