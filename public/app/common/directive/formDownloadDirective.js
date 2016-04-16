'use strict';
//http://plnkr.co/edit/octwC4BCuXLmRhHgLD8T?p=preview
reachApp.directive('vmformdownload', ['$rootScope', '$timeout', function ($rootScope, $timeout) {
    return {
        restict: 'E',
        scope: {
            downloadUrl: '@',
            controlId: '@',
            sourceObj: '='
        },
        controller: ['$scope', '$http', function ($scope, $http) {
            $scope.ReportData = [];
            //The $scope.watch() function creates a watch of some variable.
            //That way AngularJS can determine if the value has changed 
            //reference :http://tutorials.jenkov.com/angularjs/watch-digest-apply.html#watch    
            $scope.$watch(function (scope) {
                return scope.sourceObj 
            },
              function () {
                  $scope.ReportData = $scope.sourceObj;
              }
             );

        }],
        link: function (scope, element, attrs, controller) {
            element.bind("click", function () {
            	alert(scope.ReportData);
                var params = JSON.stringify(({ 'request': scope.ReportData }));
                var url = scope.downloadUrl;
                //call the custom js function to generate the report
                GenerateReport(url, params);
            });

            //-----------------------------------------------------------------------------------
            // Added the function to accept single quote in the request object
            //reference : http://stackoverflow.com/questions/24816/escaping-html-strings-with-jquery
            //-----------------------------------------------------------------------------------
            var entityMap = {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': '&quot;',
                "'": '&#39;',
                "/": '&#x2F;'
            };

            function escapeHtml(string) {
                return String(string).replace(/[&<>"'\/]/g, function (s) {
                    return entityMap[s];
                });
            }

            //-----------------------------------------------------------------------------------
            //function to  generate report using form
            //Parameters:
            //reporturl : url to fetch the report
            //params : json stringify object
            //-----------------------------------------------------------------------------------
            function GenerateReport(reporturl, params) {
                //Posting Json data to Webservice by using form and passing json string object in hidden variable and downloads the pdf file    
                var postData = escapeHtml(params);
                var formHtmlFragment = "<form style='display: none;' method='POST' action='" + reporturl + "'>";
                formHtmlFragment += "<input type='hidden' name='request' value='" + postData + "'>";
                formHtmlFragment += "</form>";
                angular.element("body").append(angular.element(formHtmlFragment));
                angular.element(formHtmlFragment).submit();
            }
        }
    };

} ]);