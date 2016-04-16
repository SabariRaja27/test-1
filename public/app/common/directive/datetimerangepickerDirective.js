//Directive for datetimerange picker
'use strict';
//http://rgkevin.github.io/datetimeRangePicker/#/home
reachApp.directive('vmDateTimeRangePicker', ['$rootScope', function ($rootScope) {
    return {
        restict: 'E',
        scope: {
            controlId: '@', //unique Id for datetimerange picker
            dateFrom: '@',  // from date -- Mandatory if date range is to be shown
            dateTo: '@',  // to date -- Mandatory if date range is to be shown
            minDate: '@', // minimum date to be enabled for selection
            maxDate: '@',  // maximum date to be enabled for selection
            timeFrom: '@', // from time -- Mandatory if time range is to be shown
            timeTo: '@',  // to time -- Mandatory if time range is to be shown
            stepTime: '@', // step time for increment/decrement
            minRange: '@', // minimum range to be selected
            is24hoursFromat: '@', // wherther 12hrs format or 24 hrs format // true by default
            hasDatePickers: '@', // wherther daterange picker is needed
            hasTimeSliders: '@', // Whether timerange slider is needed
            fromLabel: '@', // start datetime label
            toLabel:'@' //  end datetime label
        },
        controller:['$scope', '$http', function ($scope, $http) {
            //Initiating scope variable
            $scope.myDatetimeRange = {};
            //If daterange picker needed attached required properties for daterange picker
            if ($scope.hasDatePickers == 'true') {
                var date = {};
                date.from = $scope.dateFrom != undefined ? ($scope.dateFrom != "" ? $scope.dateFrom : moment()) : moment();
                date.to = $scope.dateTo != undefined ? ($scope.dateTo != "" ? $scope.dateTo : moment()) : moment();
                if ($scope.minDate != undefined && $scope.minDate != "") {
                    date.min = $scope.minDate;
                }
                if ($scope.maxDate != undefined && $scope.maxDate != "") {
                    date.max = $scope.maxDate;
                }
                $scope.myDatetimeRange.date = date;
                $scope.myDatetimeRange.hasDatePickers = true;
                if ($scope.hasTimeSliders == 'false') {
                    $scope.myDatetimeRange.hasTimeSliders = false;
                }
            }
            //If time range slider is needed attached required properties for time range slider
            if ($scope.hasTimeSliders == 'true') {
                var time = {};
                time.from = $scope.timeFrom != undefined ? ($scope.timeFrom != "" ? parseInt($scope.timeFrom) : 540) : 540; //default 540 minutes
                time.to = $scope.timeTo != undefined ? ($scope.timeTo != "" ? parseInt($scope.timeTo) : 1020) : 1020; //default 1020 minutes
                time.dFrom = 0; //default start time
                time.dTo = 1440; //default end time
                time.step = $scope.stepTime != undefined ? ($scope.stepTime != "" ? parseInt($scope.stepTime) : 15) : 15; //default set of 15 minutes
                time.minRange = $scope.minRange != undefined ? ($scope.minRange != "" ? parseInt($scope.minRange) : 15) : 15; //default range os 15 minutes
                if ($scope.is24hoursFromat != undefined)
                {
                    if ($scope.is24hoursFromat == "true")
                        time.hours24 = true;// is 24 hours format
                    else
                        time.hours24 = false;
                }
                else
                {
                    time.hours24 = false;
                }
                $scope.myDatetimeRange.time = time;
                if ($scope.hasDatePickers == 'false') {
                    $scope.myDatetimeRange.hasDatePickers = false;
                }
                $scope.myDatetimeRange.hasTimeSliders = true;
            }
            //Initiate scope variable for labels to show
            $scope.myDatetimeLabels = {
                date: {
                    from: ($scope.fromLabel != undefined ? $scope.fromLabel : 'Start Date'),
                    to: ($scope.toLabel != undefined ? $scope.toLabel : 'End Date')
                }
            }
        }],
        templateUrl: 'app/common/view/directiveTemplates/datetimerangepicker/datetimerangepicker.html',
        link: function ($scope, element, attrs, controller) {
            //subscription to get data
            $scope.$on('GetDateRangePickerValue', function (e, i) {
                //publish event with datetimerange values
                $rootScope.$broadcast('DateRangePickerValueObj', $scope.myDatetimeRange);
            });            
        }
    };
} ]);