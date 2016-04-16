'use strict';
//Good reference to create custom directive
//http://www.ng-newsletter.com/posts/directives.html
reachApp.directive('lookupTable', ['underscore', function (_) {
    return {
        restict: 'E',
        scope: {
            sourceurl: '@',
            datasource: '@',
            controlId: '@'
        },
        templateUrl: function (tElement, tAttrs) {
            return tAttrs.templateurl;
        },
        controller: ['$scope', '$rootScope', '$http', 'DTOptionsBuilder', 'DTColumnDefBuilder', '$timeout', '$modal', '$window',
            function ($scope, $rootScope, $http, DTOptionsBuilder, DTColumnDefBuilder, $timeout, $modal, $window) {
                $scope.showMasterTable = false;
                $scope.bindlookupdatatable = function () {
                    $scope.showMasterTable = false;
                    var vm = $scope;
                    vm.LookUpData = [];
                    var dataFileName = (window.location.href).split('/');
                    vm.lookUpDtOptions = DTOptionsBuilder.newOptions().withDisplayLength(10).withBootstrap().withDOM('<"H"<"leftaligned"f>r>t<"F"p>').withBootstrapOptions({
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

                    vm.lookUpDtColumnDefs = [
                        DTColumnDefBuilder.newColumnDef(0).notSortable()
                    ];
                    //Display the progress bar till success or failure  - Starts
                    $timeout(function () {
                        var objProgress = {};
                        objProgress.progress = "show";
                        objProgress.container = "dt-pbar-" + $scope.controlId;
                        $rootScope.$broadcast('showLoadProgressBar', objProgress);
                    }, 100);
                    //Display the progress bar till success or failure  - Ends
                    var sourceUrl = ($scope.sourceurl != undefined && $scope.sourceurl != '') ? $rootScope.vmuisettings.PROTONAPIURL + $scope.sourceurl : 'data/dropdown-data.json';
                    $http({ method: 'GET', url: sourceUrl }).
                        success(function (data, status, headers, config) {
                            $scope.showMasterTable = true;
                            if ($scope.datasource == "") {
                                //Added to show the tooltip in multiple lines if Name doesnot contains space and its too long
                                _.each(data, function (o) {
                                    o.Tooltipname = o.Name.replace(/(.{30})/g, "$1\n");
                                });
                                vm.LookUpData = data;
                                $rootScope.$broadcast('bindingLookupTable_Success_' + $scope.controlId, data);
                               
                            }
                            else {
                                //Added to show the tooltip in multiple lines if Name doesnot contains space and its too long
                                _.each(data[$scope.datasource], function (o) {
                                    o.Tooltipname = o.Name.replace(/(.{30})/g, "$1\n");
                                });
                                vm.LookUpData = data[$scope.datasource];
                                $rootScope.$broadcast('bindingLookupTable_Success_' + $scope.controlId, data[$scope.datasource]);
                                
                            }
                            //Display the progress bar till success or failure  - Starts
                            $timeout(function () {
                                var objProgress = {};
                                objProgress.progress = "hide";
                                objProgress.container = "dt-pbar-" + $scope.controlId;
                                $rootScope.$broadcast('showLoadProgressBar', objProgress);
                            }, 500);
                            //Display the progress bar till success or failure  - Ends                       
                        }).
                        error(function (data, status, headers, config) {
                            $scope.showMasterTable = true;
                            vm.LookUpData = [];
                            //Display the progress bar till success or failure  - Starts
                            $timeout(function () {
                                var objProgress = {};
                                objProgress.progress = "hide";
                                objProgress.container = "dt-pbar-" + $scope.controlId;
                                $rootScope.$broadcast('showLoadProgressBar', objProgress);
                            }, 500);
                            //Display the progress bar till success or failure  - Ends
                        });
                }

                $scope.bindlookupdatatable();

                $scope.$on('RebindRouteTable_' + $scope.controlId, function () {
                    $scope.bindlookupdatatable();
                });

                $scope.openLookUpModal = function (obj) {
                    obj.ActionDone = "Edit";
                    $rootScope.$broadcast('onDetailsEditClicked', obj);
                }

                $scope.showLookUpDetails = function (obj) {
                    obj.ActionDone = "View";
                    $rootScope.$broadcast('onDetailsViewClicked', obj);
                }

                $scope.ParseJSON = function (obj) {
                    return typeof (obj) == "string" ? JSON.parse(obj) : obj;
                }

                //Empty the listner to avoid multiple calls
                $rootScope.$$listeners.addRow_LookupTable = [];
                //Chaitra - Adding a row to a table - Starts
                $rootScope.$on('addRow_LookupTable', function (e, i) {
                    //if table id maches then push the object to the lookup array
                    if (i.TableName == $scope.controlId) {
                        if ($scope.LookUpData == undefined) {
                            $scope.LookUpData = [];
                        }
                        //angular.foreach($scope.LookUpData, function (o) {
                        //if (o.Id == i.tableObj.Id) {
                        if (i.tableObj.Id != undefined && i.tableObj.Id != '0') {
                            $scope.LookUpData = _.filter($scope.LookUpData, function (item) {
                                return (item.Id != i.tableObj.Id);
                            });
                        }
                        //Ranjan - Added to edit the row in datatable -- start
                        if (i.Action != undefined) {
                            if (i.Action == "Add") {
                                if (i.DataID != undefined) {
                                    $scope.LookUpData = _.filter($scope.LookUpData, function (item) {
                                        return (item.UniqueId != i.DataID);
                                    });
                                }
                                
                                if ($rootScope.datatablecount == undefined) {
                                    if ($rootScope.AllFiles == undefined || $rootScope.AllFiles.length == 0) {
                                        i.tableObj.UniqueId = 1;
                                        $rootScope.datatablecount = 1;
                                    }
                                    else {
                                        var maxunique = _.max($rootScope.AllFiles, function (o) { return o.UniqueId; });
                                        i.tableObj.UniqueId = maxunique.UniqueId + 1;
                                        $rootScope.datatablecount = maxunique.UniqueId + 1;
                                    }
                                }
                                else {
                                    i.tableObj.UniqueId = $rootScope.datatablecount;
                                }
                            }

                            else {
                                if (i.DataID != undefined) {
                                    $scope.LookUpData = _.filter($scope.LookUpData, function (item) {
                                        return (item.UniqueId != i.DataID);
                                    });
                                }

                            }
                        }
                        //Ranjan - Added to edit the row in datatable -- end
                        $scope.LookUpData.push(i.tableObj);

                        if (i.Action != undefined) {
                            if (i.Action == "Add") {
                                $rootScope.datatablecount = $rootScope.datatablecount + 1;
                            }
                        }
                        //Store the data in rootscope
                        $rootScope.AllFiles = $scope.LookUpData;
                    }
                });
                //Chaitra - Adding a row to a table - Ends

                //Ranjan - Adding row(s) on click of edit-- starts
                //Empty the listner to avoid multiple calls
                $rootScope.$$listeners.BindRows_LookupTable = [];
                $rootScope.$on('BindRows_LookupTable', function (e, i) {
                    if (i.TableName == $scope.controlId) {
                        if ($scope.LookUpData == undefined) {
                            $scope.LookUpData = [];
                        }
                        $scope.LookUpData = i;
                        $rootScope.AllFiles = $scope.LookUpData;
                    }
                });
                //Ranjan - Adding rows on click of edit-- ends





            }],
        link: function (scope, element, attrs, controller) {
        }
    };
}]);