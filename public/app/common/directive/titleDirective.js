/**
Directive to render title
Parameters: 
titleValue=Title name that will be displayed
styleValue=css
icon=icon if we need any
textValue
ControlId=id of the title
*/
'use strict';
//http://plnkr.co/edit/octwC4BCuXLmRhHgLD8T?p=preview
reachApp.directive('vmTitle', ['$rootScope', '$timeout', function ($rootScope, $timeout) {
    console.log("docs title di")
    return {
        restict: 'E',
        //replace : true, //-> this will not work in this case.
        scope: {
            titleValue: '@', // -> '@' will pass the value of the attribute whose name matches angular camelCase convention i.e. -
            styleValue: '@',
            icon: '@',
            textValue: '@',
            controlId: '@',
            expandCollapse: '@'
        },
        templateUrl: 'app/common/view/directiveTemplates/Title/Title.html',
        link: function (scope, element, attrs, controller) {
            console.log(attrs.styleValue);
            console.log(attrs.titleValue);
            scope.titleButtonClicked = function (obj) { 
                $rootScope.$emit(obj.target.getAttribute('id') + "_Clicked", obj, 'add');


            }

            var ExpandORCollapseClickHandler = function (ele) {
                angular.element(ele).on("click", function () {
                    if (angular.element(this).hasClass('fa-minus-circle')) {
                        angular.element(this).toggleClass("fa-minus-circle fa-plus-circle");
                        angular.element(this).closest('.vm-dummy-header').parent().nextAll("div").eq(0).removeClass('show').hide();
                    }
                    else if (angular.element(this).hasClass('fa-plus-circle')) {
                        angular.element(this).toggleClass("fa-plus-circle fa-minus-circle");
                        angular.element(this).closest('.vm-dummy-header').parent().nextAll("div").eq(0).removeClass('hide').show();
                    }
                });
            }

            if (scope.expandCollapse != undefined) {
                $timeout(function () {
                    angular.element("#Form_Header_ExpCol_" + scope.controlId).addClass('fa-' + scope.expandCollapse + '-circle');
                    angular.element("#Form_Header_ExpCol_" + scope.controlId).closest('.vm-dummy-header').parent().nextAll("div").eq(0).addClass(scope.expandCollapse == "plus" ? 'hide' : 'show');
                    //Attch event handler
                    ExpandORCollapseClickHandler(angular.element("#Form_Header_ExpCol_" + scope.controlId));
                }, 100);
            }
        }
    };
}]);