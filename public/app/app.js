/**
Modules Used:
i) ngRoute - Route Configuration
ii) ngAnimate - Animation
iii) ngHolder - 
iv) 720kb.background - Attaching a banckground Image for a div
v) datatables - For Datatables
vi) angular-iscroll - For iscroll
vii) datatables.bootstrap - Bootstrap datatable and pagination
viii) ui.bootstrap - For Bootstrap UI elements"
ix) ng-backstretch - For Jquery Backstretch component
x) datatables.scroller - datatable scroller
xi) daterangepicker - For daterangepicker
xii) ngSanitize - To parse html tags in a div or any element
xiii) ngResource - For invoking any resource either API (alternate way to $http)
xiv) angular-storage - For Localstorage
xv) ui.select - 
xvi)Highcharts-ng directive for highmaps
*/
'use strict';
var reachApp = angular.module('PROTONapp', ['ngRoute', 'ngAnimate', 'ngHolder', '720kb.background', 'datatables',
                                                  'angular-iscroll', 'datatables.bootstrap', 'ui.bootstrap', 'ng-backstretch',
                                                  'datatables.scroller', 'ngSanitize', 'daterangepicker', 'ngResource', 'angularFileUpload',
                                                  'perfect_scrollbar', 'angular-storage', 'ui.select', 'ngTinyScrollbar', 'toggle-switch',
                                                  'ui.comments', 'gridster', 'pb.angular.underscore', 'ng-breadcrumbs', 'truncate', 'ngBackstretch', 'validation.match',
                                                  'textAngular', 'slideMenu', 'vr.directives.slider', 'rgkevin.datetimeRangePicker', 'mwl.calendar'])//, 'angular-noty'

.config([
  '$routeProvider', '$locationProvider', '$httpProvider', function ($routeProvider, $locationProvider, $httpProvider, $rootScopeProvider, $sceDelegateProvider, commentsConfigProvider, $rootScope) {

      var routes, setRoutes;
      //Add the http ajax request interceptors
      $httpProvider.interceptors.push('httpAjaxRequestInterceptor');
      routes = ['dashboard', 'login', 'user', 'category', 'subcategory', 'servicetype', 'type', 'option', 'timeslot', 'location', 'serviceprice', 'serviceprovider', 'order', 'rating', 'configuration','eventcalendar'];

      setRoutes = function (route) {
          var config, url;
          url = '/' + route;
          var breadcrumb = route.toUpperCase();
          config = {
              templateUrl: 'app/' + route + '/view/' + route + '.html',
              //label is mandatory to show breadcrumb
              label: route
          };
          $routeProvider.when(url, config);
          // use the HTML5 History API

          return $routeProvider;
      };
      routes.forEach(function (route) {
          return setRoutes(route);
      });

      // use the HTML5 History API
     // $locationProvider.hashPrefix('!').html5Mode(true);
      
      return $routeProvider.when('/', {
          redirectTo: '/login'
      }).when('/checkbox', {
          templateUrl: 'app/checkbox/view/testCheckBox.html', label: 'checkbox'
      }).when('/orderstatus', {
          templateUrl: 'app/genericmaster/view/master.html', label: 'Order Status'
      }).when('/paymenttype', {
          templateUrl: 'app/genericmaster/view/master.html', label: 'Payment Type'
      }).when('/paymentstatus', {
          templateUrl: 'app/genericmaster/view/master.html', label: 'Payment Status'
      }).when('/role', {
          templateUrl: 'app/genericmaster/view/master.html', label: 'Role'
      }).when('/unitofmeasurement', {
          templateUrl: 'app/genericmaster/view/master.html', label: 'Unit Of Measurement'
      }).when('/ordermethod', {
          templateUrl: 'app/genericmaster/view/master.html', label: 'Order Method'
      }).when('/404', {
          templateUrl: 'app/common/view/pages/404.html',
          label: '404 page'
      }).when('/Profile/:UserId', {
          templateUrl: 'app/user/view/userprofile.html',
          label: 'Profile'
      }).otherwise({
          redirectTo: '/404'
      });
      $locationProvider.html5Mode(true);
  }]).run(['$rootScope', 'vmuisettings', function ($rootScope, vmuisettings) {
      $rootScope.vmuisettings = vmuisettings
  }])
    .filter('timeago', function () {
        return function (date) {
            return moment(date).fromNow();
        };
    })
    .filter('calendar', function () {
        return function (date) {
            return moment(date).calendar();
        };
    })
    .filter('unique', function () {
        return function (collection, keyname) {
            var output = [],
                keys = [];

            angular.forEach(collection, function (item) {
                var key = item[keyname];
                if (keys.indexOf(key) === -1) {
                    keys.push(key);
                    output.push(item);
                }
            });

            return output;
        };
    })
    //User filterMutiple if you need to filter the result based on multiple conditions inside html page in the ng-repeat function
  //Reference for multiple filter istaken from the below site
  //http://stackoverflow.com/questions/15868248/how-to-filter-multiple-values-or-operation-in-angularjs
  .filter('filterMultiple', ['$filter', function ($filter) {
      return function (items, keyObj) {
          var filterObj = {
              data: items,
              filteredData: [],
              applyFilter: function (obj, key) {
                  var fData = [];
                  if (this.filteredData.length == 0)
                      this.filteredData = this.data;
                  if (obj) {
                      var fObj = {};
                      if (!angular.isArray(obj)) {
                          fObj[key] = obj;
                          fData = fData.concat($filter('filter')(this.filteredData, fObj));
                      } else if (angular.isArray(obj)) {
                          if (obj.length > 0) {
                              for (var i = 0; i < obj.length; i++) {
                                  if (angular.isDefined(obj[i])) {
                                      fObj[key] = obj[i];
                                      fData = fData.concat($filter('filter')(this.filteredData, fObj));
                                  }
                              }

                          }
                      }
                      if (fData.length > 0) {
                          this.filteredData = fData;
                      }
                  }
              }
          };

          if (keyObj) {
              angular.forEach(keyObj, function (obj, key) {
                  filterObj.applyFilter(obj, key);
              });
          }

          return filterObj.filteredData;
      }
  }]);
