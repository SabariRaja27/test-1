/* Description: The User Profile Controller deals with displaying User Profile.
 * Author: AvinashK
 * Created On: 16/09/2015
 * Modified For: 
 * Modified On:
 * Modified By:
 * */
'use strict';
reachApp.controller('userProfilecontroller', ['userservice', '$scope', '$http', '$window', '$rootScope', '$modal', '$timeout', 'store', 'noty', '$filter', function (userservice, $scope, $http, $window, $rootScope, $modal, $timeout,store, noty, $filter) {
    $scope.GetUserDetails = function () {
        //Taking User Id From URL
        var URL = ($window.location.href).split('?')[0].split('Profile')[1].split('/');
        var UserCode = URL[1];
        //Calling GetUser Method to get User Details
        userservice.GetUser(UserCode).then(function (res) {
            if (res.Success) {
                var UserInfo = res.User;                             
                UserInfo.scopeDOB = moment.utc(UserInfo.DOB).format('YYYY-MM-DD');
                $scope.UserDetails = UserInfo;
                $scope.UserDetails.scopeFirstName = UserInfo.FirstName;
                $scope.UserDetails.scopeMiddleName = UserInfo.MiddleName;
                $scope.UserDetails.scopeLastName = UserInfo.LastName;
                $scope.UserDetails.scopeEmail = UserInfo.Email;
                $scope.UserDetails.scopeStatus = UserInfo.Status;
                $scope.UserDetails.scopeRole = UserInfo.Role;
                $scope.UserDetails.scopeDeviceID = UserInfo.DeviceID;
                $scope.UserDetails.scopeUserName = UserInfo.UserName;
                $scope.UserDetails.scopeMobileNumber = UserInfo.MobileNumber;
                $scope.UserDetails.scopeCategoryCode = UserInfo.CategoryCode;
                $scope.UserDetails.scopePassword = UserInfo.Password;
                $scope.UserDetails.scopeGender = UserInfo.Gender;
                if (UserInfo.Role == $rootScope.vmuisettings.ServicerepCode) {
                    $rootScope.servrepr = true;
                }
                else {
                    $rootScope.servrepr = false;
                }
                $rootScope.AddUser = false;
            }
        });
    }

    //Rebind user profile page after edit success
    $rootScope.$on('RebindUserProfilePage', function () {
        $scope.GetUserDetails();
    });
}]);
