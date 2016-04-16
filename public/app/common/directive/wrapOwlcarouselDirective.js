'use strict';
reachApp.directive('wrapOwlcarousel', ['$timeout', '$rootScope', function ($timeout, $rootScope) {
    return {
        restrict: 'E',
        link: function (scope, element, attrs) {
            var options = scope.$eval($(element).attr('data-options'));
            options.autoWidth = true,
            options.navigation = true;
            options.navigationText = [
                      "<i class='icon-chevron-left icon-white'><i class='fa fa-chevron-left'></i></i>",
                      "<i class='icon-chevron-right icon-white'><i class='fa fa-chevron-right'></i></i>"
            ];

            $timeout(function () {
                //we are setting a dynamic property in the rootscope to disable or enable the navigation buttons,if present
                $rootScope[element.attr('id') + "_navigationBtnDisable"] = false;
                //If the number of element in owl carousel is less than the default option item, then set the option item to count of total element.
                //disable the navigation buttons,if present
                if (element.children().length <= options.items) {
                    options.items = element.children().length;
                    $rootScope[element.attr('id') + "_navigationBtnDisable"] = true;
                }
                $(element).owlCarousel(options);
                //Done to align the horizontal arrows in the middle of the div
                //Swathi(31-Mar-15) : added below code to capture the height of panel-body in an angular way
                //to make it work i have added an attribute and class for wrap-owlcarousel to identify the different carousels in a page.
                var carouselname = element.attr('data-carouselname');
                var carouselclass = ".owl-carousel-" + carouselname;
                if (angular.element(carouselclass)[0] != undefined) {
                    var height = angular.element(angular.element(carouselclass)[0].parentElement).height() / 2;
                }
                element.find('.owl-controls').find('.owl-buttons').find('.owl-prev').css('top', height);
                element.find('.owl-controls').find('.owl-buttons').find('.owl-next').css('top', height);
                //TODO:To change it in a more angular way
                //  element.find('.owl-controls').find('.owl-buttons').find('.owl-prev').css('top', ($(element.closest('.panel-body')).height() / 2));
                //  element.find('.owl-controls').find('.owl-buttons').find('.owl-next').css('top', ($(element.closest('.panel-body')).height() / 2));
            }, 1000);
        }
    };
}]);