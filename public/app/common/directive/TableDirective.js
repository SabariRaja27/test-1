'use strict';
//http://plnkr.co/edit/octwC4BCuXLmRhHgLD8T?p=preview
reachApp.directive('tableGeneric', ['$templateCache', '$timeout', '$rootScope', function ($templateCache, $timeout, $rootScope) {
    return {
        restict: 'E',
        //replace : true, //-> this will not work in this case.
        scope: {
            items: '=', //'=' -> will pass the object as-is as the name of the arrtibute matches
            controlId: '@',
            templateHeader: '@',
            templateBody: '@'
        },
        link: function (scope, element, attrs, controller) {
            //load the templates
            var templateHeader = $templateCache.get(attrs.templateHeader);
            var templateBody = $templateCache.get(attrs.templateBody);
            //append the templates into the body
            angular.element(element[0]).append(templateHeader);
            $rootScope.$on('TableLoad_Products', function (event, args) {
               // $timeout(function () {
                $templateCache.put(attrs.templateHeader, args.products).append(element[0] +'table tbody');
                    //angular.element(element[0]).find('table tbody').append(templateBody);
               // }, 1000);
            });
        }
    };

}]);