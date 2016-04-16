'use strict';
//http://plnkr.co/edit/octwC4BCuXLmRhHgLD8T?p=preview
reachApp.directive('progressBarPanel',['$timeout', '$rootScope', 'store', function ($timeout, $rootScope, store) {
    return {
        restict: 'E',
        //replace : true, //-> this will not work in this case.
        scope: {
            controlId: '@',
            panelTitle: '@',
            textType: '@',
            valueType: '@',
            /*sourceUrl: '@',
            sourceObj: '@',*/
            progressbarItems: '=',
            panelHeadingClass: '@'
        },
        /*controller: function ($scope, $http) {
           if ($scope.sourceUrl != undefined) {
                return $http({ method: 'GET', url: $scope.sourceUrl }).
                    success(function (data, status, headers, config) {
                        return $scope.ProgressBarItems = data[$scope.sourceObj];
                    }).
                    error(function (data, status, headers, config) {
                        console.log("error retrieving " + $scope.masterName + " details");
                    });
            }
        	
        	 return $scope.ProgressBarItems;
        },*/
		 
        templateUrl: 'app/common/view/directiveTemplates/progressbar/progressbar.html',
        link: function ($scope, element, attrs, controller) {

        }
    };

}]);