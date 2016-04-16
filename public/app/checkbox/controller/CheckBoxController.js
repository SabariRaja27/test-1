'use strict';
reachApp.controller('checkboxController', ['$scope', '$http', '$window', '$rootScope', 'store', 'noty',
                                        '$modal', function ($scope, $http, $window, $rootScope, store, noty, $modal) {
	
	
	 $scope.save = function (res) { debugger
		 if($scope.chkboxForm.$valid){
			 var ff = res;
		 }
		 
	 }
}]);
