'use strict';
reachApp.directive('serversidePagination', ['$window', 'ServerSidePaginationService', '$rootScope', function ($window, ServerSidePaginationService, $rootScope) {
    return {
        restict: 'E',
        replace: true, //-> this will not work in this case.
        scope: {
            totalPages: "=",
            currentPage: "=",
            totalRecords: "=",
            currentRecords: "=",
            url: "="
        },
        templateUrl: "app/common/view/directiveTemplates/ServerSidePagination/ServerSidePagination.html",
        link: function (scope, element, attrs) {
            scope.pages = [];
            //the number of pages shown at any point in time is set to 5 
            //'scope.pageindex' is the starting index of each page array
            scope.pageindex = 1;

            scope.$watch('totalPages', function () {
                createPageArray(scope.pages, scope.pageindex, scope.totalPages);

            });
            //function called to load the next set of records on click of the next icon
            scope.gotoNextPage = function (p) {
                //we are incrementing the page index by 5 and creating the next set of pages
                scope.pageindex = scope.pageindex + 5;
                if (scope.pageindex > scope.totalPages) {
                    scope.pageindex = scope.totalPages;
                }
                createPageArray(scope.pages, scope.pageindex, scope.totalPages);
                //by default records corresponding the first page number of any page array will be shown
                ServerSidePaginationService.navigate(scope.pageindex, attrs.url)

            };
            //function called to load the previous set of records on click of the previous icon
            scope.gotoPreviousPage = function (p) {
                scope.pageindex = scope.pageindex - 5;
                if (scope.pageindex < 1) {
                    scope.pageindex = 1
                }
                createPageArray(scope.pages, scope.pageindex, scope.totalPages);
                ServerSidePaginationService.navigate(scope.pageindex, attrs.url)

            };
            //function called to load current records on click of any page number
            scope.gotoPage = function (p) {
                ServerSidePaginationService.navigate(p, attrs.url)

            };
            //Swathi(14-Oct-15): The below event is fired when search is clicked to set pages array and page index
            $rootScope.$on('ResetServerSidePagination', function (i, args) {
                scope.pages = [];
                scope.pageindex = 1;
            });
            //ends
        }
    };

    //function called to create the page array  
    function createPageArray(pages, pageindex, totalPages) {
        var i;
        pages.length = 0;
        //the number of pages shown is set to 5 
        //that is every time 5 pages will be shown
        //on click of the next/previous icons the next/previous sets of pages will be shown
        for (i = pageindex; i < pageindex + 5; i++) {
            //once pageindex is equal to the total number of pages,come out of the loop
            if (i <= totalPages) {
                pages.push(i);
            }
            else {
                break;
            }
        }
    }

}]);