'use strict';
reachApp.controller('UsergridController', ['DTOptionsBuilder', 'DTColumnDefBuilder', '$scope', '$modal', '$rootScope', '$window', '$resource', 'store', 'userservice', 'ServerSidePaginationService','underscore', function (DTOptionsBuilder, DTColumnDefBuilder, $scope, $modal, $rootScope, $window, $resource, store, userservice, ServerSidePaginationService, _) {
    
   
    //Initiating the grid
    //$scope.initiateTable = function () {
    //    //pagination starts
    //    //initializing the table 
    //    var vm = this;
    //    $scope.tblOrders_pages = ServerSidePaginationService.paginationServiceParams().ssp_pages;
    //    $scope.tblOrders_pagesinfo = ServerSidePaginationService.paginationServiceParams().paging.ssp_info;
    //    var tableoptions = {};
    //    tableoptions.TableName = 'tblOrders';//expects the table id
    //    var sortableColumns = [];
    //    ServerSidePaginationService.initializeTable(tableoptions, sortableColumns);
    //    vm.dtOptions = ServerSidePaginationService.paginationServiceParams().tableParams.dtOptions;
    //    vm.dtColumnDefs = ServerSidePaginationService.paginationServiceParams().tableParams.dtColumnDefs;
    //    //pagination ends
    //}

    var vm = $scope;
    vm.dtOptions = DTOptionsBuilder.newOptions().withOption('order', [0, 'enabled']).withDisplayLength(10).withBootstrap().withBootstrapOptions({
        TableTools: {
            classes: {
                container: 'btn-group',
                buttons: {
                    normal: 'btn btn-danger'
                }
            }
        },
        pagination: {
            classes: {
                ul: 'pagination pagination-sm'
            }
        }
    });

    vm.dtColumnDefs = [
        DTColumnDefBuilder.newColumnDef(0).notSortable(),
        DTColumnDefBuilder.newColumnDef(1).notSortable(),
        DTColumnDefBuilder.newColumnDef(2).notSortable(),
        DTColumnDefBuilder.newColumnDef(3).notSortable(),
        DTColumnDefBuilder.newColumnDef(4).notSortable(),
        DTColumnDefBuilder.newColumnDef(5).notSortable(),
        DTColumnDefBuilder.newColumnDef(6).notSortable(),
        DTColumnDefBuilder.newColumnDef(7).notSortable(),
        DTColumnDefBuilder.newColumnDef(8).notSortable()
    ];

    $scope.usersearchdetails = false;
    $rootScope.$on('onSearchUserClicked', function (i, o) {
        var request = o;
        userservice.SearchUser(request).then(function (res) {
            if (res.Success) {
                if (res.ViewModels.length > 0) {
                    $scope.usersearchdetails = true;
                    _.each(res.ViewModels, function (o) {
                        if (o.Address != undefined) {
                            o.City = JSON.parse(o.Address.Address).City;
                            o.Address = JSON.parse(o.Address.Address).StreetLine1 + " " + JSON.parse(o.Address.Address).StreetLine2 + " " + JSON.parse(o.Address.Address).City + " " + JSON.parse(o.Address.Address).State + " " + JSON.parse(o.Address.Address).Country + " " + JSON.parse(o.Address.Address).Pincode;
                        }
                        if (o.DocumentCode != null) {
                            var request = {};
                            request.RequestCode = o.Code;
                            request.RequestType = "User";
                            userservice.GetDocument(request).then(function (res) {
                                if (res.Success && res.DocumentDetails.length > 0) {
                                    o.imagepresent = true;
                                    o.userimage = 'data:' + res.DocumentDetails[0].ContentType + ';base64,' + res.DocumentDetails[0].Base64File;
                                }
                            });
                        }
                        else {
                            o.imagepresent = false;
                        }
                        //if ($rootScope.vmuisettings.ServicerepCode == o.Role) {
                        //    o.servrep = true;
                        //    $scope.servrep = true;
                        //}
                        //else {
                        //    o.servrep = false;
                        //    $scope.servrep = false;
                        //}
                    });
                    var name = angular.element("#Search_ByName").val();
                    var filteredresult = [];
                    if (name != "" && name != undefined) {
                        var searchText = name.toLowerCase();
                        angular.forEach(res.ViewModels, function (item) {
                            if (item.Name.toLowerCase().indexOf(searchText) >= 0) filteredresult.push(item);
                        });
                        res.ViewModels = filteredresult;
                    }
                    vm.Users = res.ViewModels;
                }
                else {
                    $scope.usersearchdetails = true;
                    vm.Users = [];
                    $timeout(function () {
                        $(".dataTables_info").remove();
                    }, 100);

                }
            }
            else {

            }
        });
    });


    $scope.FormatDate = function (date) {
        return moment(date).format('DD-MMM-YYYY');
    }


    //$scope.GetImage = function (data) {
    //    var image = "";
    //    var request = {};
    //    request.RequestCode = data;
    //    request.RequestType = "User";
    //    userservice.GetDocument(request).then(function (res) {
    //        if (res.Success && res.DocumentDetails.length > 0) {
    //            image = 'data:' + res.DocumentDetails[0].ContentType + ';base64,' + res.DocumentDetails[0].Base64File;
    //        }
    //    });
    //    return image;
    //}

    //$scope.GetAddress = function (data) {
    //    var addr = "";
    //    userservice.GetAddressforUser(data).then(function (res) {
    //        if (res.Success) {
    //            if (res.ViewModels.length > 0) {
    //                addr =  res.ViewModels[0].Address;
    //            }
    //        }
    //    });
    //    return addr;
    //}

}]);