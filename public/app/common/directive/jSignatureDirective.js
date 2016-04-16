/*
*
* https://github.com/brinley/jSignature/blob/master/README.md

*Parameters: width   Defines the width of the canvas. Numerical value without % or px    250
            height  Defines the height of the canvas. Numerical value without % or px   150
            color   Defines the color of the strokes on the canvas. Accepts any color hex values.   #000
            background-color    Defines the background color of the canvas. Accepts any color hex values.   #fff
            lineWidth   Defines the thickness of the lines. Accepts any positive numerical value    1
            cssclass    Defines a custom class for the canvas.  None
*
*Example :<div class="signatureBorder">
               <j-signature-directive sig="your.signature.model"></j-signature-directive>
               </div>
             <div id="signature"></div>
*/

reachApp.directive('jSignatureDirective', function () {
    return {
        restrict: 'E',
        template: '<button type="button" class="btn btn-success" ng-click="getData()">Save</button><button type="button" class="btn btn-danger" ng-click="reset()">reset</button>',
        scope: {
            sig: '=',
            width: '@',
            height: '@',
            bgColor: '@',
            lineWidth: '@',
            cssclass: '@'
        },
        link: function ($scope, $element) {

            $scope.initialized = false;

            var options = {
                width: $scope.width,
                height: $scope.height,
                color: $scope.color,
                'background-color': $scope.bgColor,
                'decor-color': 'transparent', //removes the line from the canvas
                lineWidth: $scope.lineWidth,
                cssclass: $scope.cssclass
            };

            //initialize the options
            $scope.initialize = function () {
                if (!$scope.initialized) {
                    $element.jSignature(options);
                    $scope.initialized = true;

                }
            };

            //function called to reset the image
            $scope.reset = function () {
                $element.jSignature('reset');
            };

            //function called on click of save
            $scope.getData = function () {
                console.log('getData!!!');
                var datapair = $element.jSignature('getData', 'base30');
                $scope.setData(datapair[1]);
                console.dir(datapair);
            };

            //function to render the image back to a div
            $scope.setData = function (sig) {
                console.log('setData!!!');
                var datapair = ['image/jsignature;base30'];
                if (sig) {
                    datapair[1] = sig;
                    angular.element('#signature').empty().jSignature(options);
                    angular.element('#signature').jSignature('setData', 'data:' + datapair.join(','));
                    angular.element('#signature').jSignature('disable');
                }

            };
            $scope.initialize();

        }
    };
});