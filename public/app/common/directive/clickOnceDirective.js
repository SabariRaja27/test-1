/**
Directive to render title
Prevents multiple click for button
*/
'use strict';
//http://plnkr.co/edit/octwC4BCuXLmRhHgLD8T?p=preview
reachApp.directive('clickOnce', ['$timeout',function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var replacementText = attrs.clickOnce;
            element.bind('click', function () {
                var isFormValid = scope[attrs.formname].$invalid;
                if (!isFormValid) {
                    $timeout(function () {
                        if (replacementText) {
                            element.html(replacementText);
                        }
                        element.attr('disabled', true);
                    }, 0);
                }
            });
        }
    };
}]);