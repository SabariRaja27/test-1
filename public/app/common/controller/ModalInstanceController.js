reachApp.controller('ModalInstanceCtrl',['$scope', '$modalInstance', 'items', '$rootScope','$timeout', function ($scope, $modalInstance, items, $rootScope,$timeout) {
    $scope.items = items;
    //Added the IsValidForm parameter to get if the corresponding form is validated or not
    //If IsValidForm is false : Validation is  added in the form and the form is not validated,so do not dismiss the modal
    //If IsValidForm is true : Validation is  added in the form and the form is  validated,so  dismiss the modal
    //If IsValidForm is undefined : Validation is not added in the form,so dismiss the modal
    $scope.cancel = function (IsValidForm) {
        if (IsValidForm == true || IsValidForm == undefined) {
        	$timeout(function () { $modalInstance.dismiss('cancel'); }, 500);            
        }

    };
    $scope.$on('$routeChangeStart', function () {
        $modalInstance.close();
    });
}]);
