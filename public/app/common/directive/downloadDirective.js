'use strict';
//http://plnkr.co/edit/octwC4BCuXLmRhHgLD8T?p=preview
reachApp.directive('vmDownload', ['$rootScope', '$timeout', function ($rootScope, $timeout) {
    return {
        restict: 'E',
        templateUrl: 'app/common/view/directiveTemplates/download/download.html',
        scope: {
            downloadUrl: '@',
            controlId: '@',
            elementId: '@'
        },
        link: function (scope, element, attrs, controller) {
            console.log(attrs.controlId);

            function download_Callback(iframe) {
            }

            //  to create IFrame
            function CreateIFrame(oSrcCtrl, strFraId, callback) {
                angular.element('<iframe />', {
                    name: strFraId,
                    id: strFraId,
                    scrolling: 'no',
                    frameBorder: '0'
                }).appendTo("#" + oSrcCtrl);

                if (callback != null) {
                    angular.element("#" + strFraId).load(function () { callback(this); });
                }
            }

            scope.onClickEvent = function () {
                try {
                    CreateIFrame(scope.elementId, "frmDownload", download_Callback);
                    var objFrame = angular.element("#frmDownload");
                    objFrame[0].src = scope.downloadUrl;
                    console.log(objFrame[0].src);
                } catch (e) { }
            };

        }
    };

}]);