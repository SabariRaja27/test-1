'use strict';
//http://plnkr.co/edit/octwC4BCuXLmRhHgLD8T?p=preview
reachApp.directive( 'angularTextEditor', ['$timeout', '$rootScope',function ( $timeout, $rootScope )
{
    return {
        restict: 'E',
        scope: {
            htmlcontent: '=',
            controlId: '@',
            requierdField:'@'
        },
        templateUrl: 'app/common/view/directiveTemplates/angularTextEditor/angularTextEditor.html',
        link: function ( $scope, element, attrs, controller )
        {
            
        }
    };
    
}]);