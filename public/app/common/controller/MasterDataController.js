'use strict';
reachApp.controller('masterDataController',['$scope',' masterDataService', '$window', '$timeout', '$rootScope', function ($scope, masterDataService, $window, $timeout, $rootScope) {

    $scope.signIn = function () {
        $window.location.href = '/dashboard';
    };


//    var findAllCustomer = function () {
//        masterDataService.findAllCustomer().then(function (res) {
//            $scope.Customer = res;
//            if ($scope.$parent.items != undefined) {
//                $scope.selectedCustomer = $scope.$parent.items.customer;
//            }
//            //TODO:using ng-model bind the dropdown
//            $timeout(function () {
//                //$("#cboCustomer").select2('val', '01');
//            }, 0);
//        });
//    }

    var findAllCustomer = function () {
        masterDataService.findAllCustomer().then(function (res) {
            $scope.Customer = res;
            $rootScope.$broadcast("Customer_OnLoadSuccess", res);
            //$scope.selectedCustomer = $scope.$parent.items.customer;
        });
    }

    var findAllState = function () {
        masterDataService.findAllState().then(function (res) {
            $scope.State = res;
            if ($scope.$parent.items != undefined) {
                //$scope.selectedState = $scope.$parent.items.st;
                $rootScope.$broadcast("State_OnLoadSuccess", res);
            }
        });
    }

    var findAllCity = function () {
        masterDataService.findAllCity().then(function (res) {
            $scope.City = res;
            if ($scope.$parent.items != undefined) {
                //$scope.selectedCity = $scope.$parent.items.city;
                $rootScope.$broadcast("City_OnLoadSuccess", res);
            }
        });
    }

    var findAllCoolerCode = function () {
        masterDataService.findAllCoolerCode().then(function (res) {
            $scope.CoolerCode = res;
            if ($scope.$parent.items != undefined) {
                //$scope.selectedCooler = $scope.$parent.items.coolercode;
                $rootScope.$broadcast("CoolerCode_OnLoadSuccess", res);
            }
        });
    }

    var findAllCarrier = function () {
        masterDataService.findAllCarrier().then(function (res) {
            $scope.Carrier = res;
            if ($scope.$parent.items != undefined) {
                //$scope.selectedCarrierSeq = $scope.$parent.items.carrierseq;
                $rootScope.$broadcast("Carrier_OnLoadSuccess", res);
            }
        });
    }



    findAllCustomer();
    findAllState();
    findAllCity();
    findAllCoolerCode();
    findAllCarrier();
}]);