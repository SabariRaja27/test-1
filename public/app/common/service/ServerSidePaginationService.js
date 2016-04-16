'use strict';
reachApp.factory('ServerSidePaginationService', ['$http', '$q', 'DTOptionsBuilder', 'DTColumnDefBuilder', '$rootScope', function ($http, $q, DTOptionsBuilder, DTColumnDefBuilder, $rootScope) {
    var paginationServiceParams = {
        ssp_pages: [],
        paging: {
            ssp_info: {
                totalItems: 0,
                totalPages: 1,
                currentPage: 0,
                page: 1,
                limit: 10,
                from: 0,
                where_condition: ""
            }
        },
        tableParams: {
            dtOptions: [],
            dtColumnDefs: []
        }
    };


    return {
        initializeTable: function (dtOptions, dtcolumndefs) {
           // if (dtOptions.scrollx) {
            paginationServiceParams.tableParams.dtOptions = DTOptionsBuilder.newOptions().withOption('order', [0, 'enabled']).withBootstrap().withDisplayLength(paginationServiceParams.paging.ssp_info.limit).withDOM('<"H"<>r>t<>').withBootstrapOptions({
                TableTools: {
                    classes: {
                        container: 'btn-group',
                        buttons: {
                            normal: 'btn btn-danger'
                        }
                    }
                }
            });
         //   }
            
            var sortableColumns = [];
            var columnNos = angular.element(angular.element('#' + dtOptions.TableName)[0]).find('thead').find('tr').children().length;
            for (var i = 0; i < columnNos; i++) {
                if (dtcolumndefs.length > 0) {
                    if (dtcolumndefs.indexOf(i) == -1) {
                        sortableColumns.push(DTColumnDefBuilder.newColumnDef(i).notSortable());
                    }
                }
                else {
                    sortableColumns.push(DTColumnDefBuilder.newColumnDef(i).notSortable());
                }
            }
            paginationServiceParams.tableParams.dtColumnDefs = sortableColumns;

        },
        attachServerSidePagination: function (params) {
            this.clear();
            paginationServiceParams.paging.ssp_info.where_condition = params.criteria;
            this.navigate(1, params.Url);
        },
        navigate: function (pageNumber, serversideUrl) {
            var dfd = $q.defer();

            if (pageNumber > paginationServiceParams.paging.ssp_info.totalPages) {
                return dfd.reject({ error: "page number out of range" });
            }

            if (paginationServiceParams.ssp_pages[pageNumber]) {
                paginationServiceParams.paging.ssp_info.currentPage = pageNumber;
                dfd.resolve();
            } else {
                return this.load(pageNumber, serversideUrl);
            }

            return dfd.promise;
        },
        load: function (pageNumber, serversideUrl) {
            var deferred = $q.defer(); //promise
            $http({
                url: $rootScope.vmuisettings.PROTONAPIURL + 'api/' + serversideUrl + '?Limit=' + paginationServiceParams.paging.ssp_info.limit + '&Page=' + pageNumber
                + '&Where=' + paginationServiceParams.paging.ssp_info.where_condition
            }).
                success(function (data, status, headers, config) {
                    deferred.resolve(data);
                }).
                error(function (data, status, headers, config) {
                    deferred.reject(status);
                });

            return deferred.promise.then(
                        function (result) {
                            var newPage = {
                                number: paginationServiceParams.paging.ssp_info.limit,
                                result: []
                            };

                            result.ViewModel.forEach(function (data) {
                                newPage.result.push(data);
                            });
                            
                            paginationServiceParams.ssp_pages[pageNumber] = newPage;
                            paginationServiceParams.paging.ssp_info.currentPage = pageNumber;
                            paginationServiceParams.paging.ssp_info.totalPages = result.TotalPages;
                            paginationServiceParams.paging.ssp_info.totalItems = result.TotalRecords;
                            return result.$promise;
                        }, function (result) {
                            return $q.reject(result);
                        });
        },
                 clear: function () {
            paginationServiceParams.ssp_pages.length = 0;
            paginationServiceParams.paging.ssp_info.totalItems = 0;
            paginationServiceParams.paging.ssp_info.currentPage = 0;
            paginationServiceParams.paging.ssp_info.totalPages = 1;
        },
        paginationServiceParams: function () { return paginationServiceParams; },
        initialize: function () {
            paginationServiceParams.paging.ssp_info.currentPage = 1;
        }
    }
} ]);


