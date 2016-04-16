'use strict';
reachApp.controller('mastercontroller', ['masterservice', '$scope', '$rootScope', '$modal', '$log', '$window', 'noty', '$filter', function (masterservice, $scope, $rootScope, $modal, $log, $window, noty, $filter) {
    console.log("--> mastercontroller")
    $rootScope.noty = noty;
    $scope.ViewClicked = false;
    $scope.$parent.$on('onDetailsViewClicked', function (event, args) {
        $scope.ViewClicked = true;
        $scope.details = args;
        if (args.Status == "1") {
            $scope.Status = "Enabled";
        }
        else {
            $scope.Status = "Disabled";
        }
        $rootScope.vmuisettings.singlemasterviewclicked = true;
    });
    var ViewPath = ($window.location.href).split('/');
    $scope.ViewName = ViewPath[ViewPath.length - 1];
    $scope.SourceURL = 'api/' + ViewPath[ViewPath.length - 1];

    if ($scope.ViewName == "orderstatus") {
        $scope.TitleName = "Order Status";
    }
    else if ($scope.ViewName == "paymenttype") 
    {
        $scope.TitleName = "Payment Type";
    }
    else if ($scope.ViewName == "paymentstatus") {

        $scope.TitleName = "Payment Status";
    }
    else if ($scope.ViewName == "role") {

        $scope.TitleName = "Role";
    }
    else if ($scope.ViewName == "unitofmeasurement") {

        $scope.TitleName = "Unit Of Measurement";
    }
    else if ($scope.ViewName == "ordermethod") {

        $scope.TitleName = "Order Method";
    }
    else {
        $scope.TitleName = $scope.ViewName;
    }
    
    $scope.$parent.$$listeners.onDetailsEditClicked = [];

    $scope.$parent.$on('onDetailsEditClicked', function (event, args) {
        $scope.openMasterModal('sm', args, args.ActionDone);
    });

    $scope.SaveData = function (obj) {
        if ($scope.MasterForm.$valid) {
            var request = {};
            request.Name = obj.MasterName == undefined ? "" : obj.MasterName;
            request.Status = obj.switchStatus == undefined ? false : obj.switchStatus;
            request.UserID = 1;
            if (obj.Id == "0") {
                var URL = $rootScope.vmuisettings.PROTONAPIURL + $scope.SourceURL + '/0';
                var MethodType = "POST";
                request.MethodType = "POST";
            }
            else {
                var URL = $rootScope.vmuisettings.PROTONAPIURL + $scope.SourceURL + '/' + obj.Code;
                var MethodType = "PUT";
                request.Id = obj.Id;
                request.MethodType = "PUT";
            }

            masterservice.SaveData(request, URL, MethodType).then(function (res) {
                if (res.Success) {
                    $scope.cancel();
                    noty.add({ type: 'success', body: res.Message });
                    $rootScope.$on('bindingLookupTable_Success_' + $scope.ViewName, function (event, args) {
                        if ($rootScope.vmuisettings.singlemasterviewclicked) {
                            var JsonResult = res.ViewModel;
                            var myObject = $filter('filter')(args, { Code: JsonResult.Code });
                            if (myObject.length > 0) {
                                $rootScope.$broadcast('onDetailsViewClicked', myObject[0]);
                            }
                        }
                    });
                    $rootScope.$broadcast('RebindRouteTable_' + $scope.ViewName);
                }
                else {
                    $scope.cancel();
                    noty.add({ type: 'danger', body: res.Message });
                }
            });
        }
    }

    $scope.openMasterModal = function (size, res, action) {
        //$rootScope.$$listeners.onMasterDetailsEditClicked = [];
        if (action != undefined && action != 'add') {
            $rootScope.MasterModelTitle = "Edit";
            if (res.Status == "1") {
                res.switchStatus = true;
            }
            else {
                res.switchStatus = false;
            }
            res.MasterName = res.Name;
            $rootScope.MasterDetails = res;
        }
        else if (action == 'add') {
            $rootScope.MasterModelTitle = "Add";
            $rootScope.MasterDetails = {};
            $rootScope.MasterDetails.Id = "0";
        }
        var modalInstance = $modal.open({
            templateUrl: 'myMasterModalContent.html',
            controller: 'ModalInstanceCtrl',
            size: size,
            backdrop: 'static',
            resolve: {
                items: function () {
                    if (action != undefined) {
                        return $rootScope.MasterDetails;
                    }
                }
            }
        });
        modalInstance.result.then(function (res) {
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };

} ]);