//'use strict';
////http://plnkr.co/edit/octwC4BCuXLmRhHgLD8T?p=preview
//reachApp.directive( 'address', ['$rootScope',function ($rootScope)
//{
	 
//    return {
//        restict: 'E',
//        //replace : true, //-> this will not work in this case.
//        scope: {
//            controlId: '@'
//        },
//        templateUrl: 'app/common/view/directiveTemplates/address/address.html',
//        link: function ( $scope, element, attrs, controller )
//        { 
//        var AddressDetails = {};
//        $scope.$on('AddressDetails_' + attrs.controlid, function (event) { 
//        	var test1=element;
//        	var test2=attrs;
//            AddressDetails.AddressLine1 = $scope.AddressLine1;
//            AddressDetails.AddressLine2 = $scope.AddressLine2;
//            AddressDetails.Country = $scope.countryModel;
//            AddressDetails.State = $scope.stateModel;
//            AddressDetails.City = $scope.City;
//            AddressDetails.PostalCode = $scope.PostalCode;
//            $scope.$root.UserDetails.AddressDetails=AddressDetails;
//            //$rootScope.AddressDetails = AddressDetails;
//        });
//        }
//    };
    
//}]);


'use strict';
//http://plnkr.co/edit/octwC4BCuXLmRhHgLD8T?p=preview
reachApp.directive('address', ['$rootScope', function ($rootScope) {
    return {
        restict: 'E',
        //replace : true, //-> this will not work in this case.
        scope: {
            controlId: '@'
        },
        templateUrl: 'app/common/view/directiveTemplates/address/address.html',
        link: function ($scope, element, attrs, controller) {
            var AddressDetails = {};
            $scope.$on('AddressDetails_' + $scope.controlId, function (event) {
                var test1 = element;
                var test2 = attrs;
                AddressDetails.AddressLine1 = $scope.AddressLine1;
                AddressDetails.AddressLine2 = $scope.AddressLine2;
                AddressDetails.Country = $scope.countryModel;
                AddressDetails.State = $scope.stateModel;
                AddressDetails.City = $scope.City;
                AddressDetails.PostalCode = $scope.PostalCode;
                $scope.$root.UserDetails.AddressDetails = AddressDetails;
            });
            $scope.$on('GetAddressDetails_' + $scope.controlId, function (event, data) {
                var address = JSON.parse(data);
                $scope.AddressLine1 = address.StreetLine1;
                $scope.AddressLine2 = address.StreetLine2;
                /*$scope.Country=address.countryModelCode;
            	$scope.State=address.stateModelCode;*/
                $scope.Country = address.Country;
                $scope.State = address.State;
                $scope.City = address.City;
                $scope.PostalCode = address.Pincode;
            });

            $scope.$on('ClearAddress_' + $scope.controlId, function (event, data) {
                $scope.AddressLine1 = "";
                $scope.AddressLine2 = "";
                /*$scope.Country="";
            	$scope.State="";*/
                $scope.City = "";
                $scope.PostalCode = "";
                $scope.Country = "";
                $scope.State = "";
            });
            $rootScope.$broadcast('addressDirective_Loaded_' + $scope.controlId, null);
        }
    };
}]);