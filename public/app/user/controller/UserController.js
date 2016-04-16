'use strict';
reachApp.controller('usercontroller', ['userservice', '$scope', '$http', '$window', '$rootScope', '$modal', '$timeout', 'noty', '$filter', function (userservice, $scope, $http, $window, $rootScope, $modal, $timeout, noty, $filter) {
    //On user details edit clicked
    $scope.$parent.$on('onDetailsEditClicked', function (event, args) {
        //Empty the scope variable before binding
        $rootScope.UserDetails = {};
        //Open modal
        $scope.openUserModal('md', args, args.ActionDone);
    });
    $rootScope.maxDOB = new Date();
    //User View Click will be false by default
    $scope.UserViewClicked = false;
    //On user details view clicked
    $scope.$parent.$on('onDetailsViewClicked', function (event, args) {
        //Profile picture will be false by default
        $scope.profilepicpresent = false;
        var request = {};
        request.RequestCode = args.Code;
        request.RequestType = "User";
        //Get document
        userservice.GetDocument(request).then(function (res) {
            if (res.Success && res.DocumentDetails.length > 0) {
                $timeout(function () {
                    //Profile picture will be set to true if image is present
                    $scope.profilepicpresent = true;
                    //Bind as base64 file
                    $scope.userProfileImage = 'data:' + res.DocumentDetails[0].ContentType + ';base64,' + res.DocumentDetails[0].Base64File;
                }, 10);                
            }
        });
        //User View clicked will be true
        $scope.UserViewClicked = true;
        var username = args.FirstName + " " + args.MiddleName + " " + args.LastName;
        $scope.username = username.replace(/(.{60})/g, "$1\n");
        $scope.useremail = args.Email;
        $scope.usermobile = args.MobileNumber;
        var UserCode = args.Code;
        //Calling GetUser Method to get User Details
        userservice.GetUser(UserCode).then(function (res) {
            if (res.Success) {
                var UserInfo = res.User;
                $scope.userrole = UserInfo.UserRole;
            }
        });
        if (args.Status == "1") {
            $scope.Status = "Enabled";
        }
        else {
            $scope.Status = "Disabled";
        }
        //This is for rebinding details if details are already clicked to view
        $rootScope.vmuisettings.singlemasterviewclicked = true;
    });

    //On profile picture added
    $scope.$on('ImageAdded', function (e, i) {
        $rootScope.$broadcast('HoldProfilePicture', i[0]);
        var oFReader = new FileReader();
        oFReader.readAsDataURL(i[0]);
        //Read the file and bind suddenly to image div
        oFReader.onload = function (oFREvent) {
            $scope.$apply(function () {
                $scope.userImage = oFREvent.target.result;
            });            
        };
    });

    //User popup
    $scope.openUserModal = function (obj, args) {
        //Default profile image
        $rootScope.userImage = "/app/img/user.jpg";
        //For adding new user
        if (obj == null) {
            $rootScope.userModelTitle = "Add User";
            $rootScope.UserDetails = {};
            $rootScope.UserDetails.Status = true;
            $rootScope.UserDetails.Id = "0";
            $rootScope.AddUser = true;
            $rootScope.servrepr = false;
            $scope.$on('addressDirective_Loaded_useraddress', function () {
                $rootScope.$broadcast('ClearAddress_useraddress', null);
            });
        }
            //For user edit
        else {
            var request = {};
            request.RequestCode = args.Code;
            request.RequestType = "User";
            userservice.GetDocument(request).then(function (res) {
                if (res.Success && res.DocumentDetails.length > 0) {
                    $rootScope.userImage = 'data:' + res.DocumentDetails[0].ContentType + ';base64,' + res.DocumentDetails[0].Base64File;
                }
            });
            if (args.Role == $rootScope.vmuisettings.ServicerepCode) {
                $rootScope.servrepr = true;
            }
            else {
                $rootScope.servrepr = false;
            }
            userservice.GetAddressforUser(args.Id).then(function (res) {
                if (res.Success) {
                    if (res.ViewModels.length > 0) {
                        //args.AddressLine1 = JSON.parse(res.ViewModels[0].Address).StreetLine1;
                        //args.AddressLine2 = JSON.parse(res.ViewModels[0].Address).StreetLine2;
                        //args.Country = JSON.parse(res.ViewModels[0].Address).Country;
                        //args.State = JSON.parse(res.ViewModels[0].Address).State;
                        //args.City = JSON.parse(res.ViewModels[0].Address).City;
                        //args.PostalCode = JSON.parse(res.ViewModels[0].Address).Postalcode;
                        //$scope.$on('addressDirective_Loaded_useraddress', function () {
                        $rootScope.$broadcast('GetAddressDetails_useraddress', res.ViewModels[0].Address);
                        //});
                    }
                }
            });
            $rootScope.userModelTitle = "Edit User";
            $rootScope.UserDetails = args;
            if (args.DOB != null && args.DOB != undefined) {
                $rootScope.UserDetails.scopeDOB = moment(args.DOB).format("DD-MMM-YYYY");
            }
            else {
                $rootScope.UserDetails.scopeDOB = null;
            }
            
            $rootScope.UserDetails.scopeFirstName = args.FirstName;
            $rootScope.UserDetails.scopeMiddleName = args.MiddleName;
            $rootScope.UserDetails.scopeLastName = args.LastName;
            $rootScope.UserDetails.scopeEmail = args.Email;
            $rootScope.UserDetails.scopeStatus = args.Status;
            $rootScope.UserDetails.scopeRole = args.Role;
            $rootScope.UserDetails.scopeDeviceID = args.DeviceID;
            $rootScope.UserDetails.scopeUserName = args.UserName;
            $rootScope.UserDetails.scopeMobileNumber = args.MobileNumber;
            $rootScope.UserDetails.scopePassword = args.Password;
            $rootScope.UserDetails.scopeCategoryCode = args.CategoryCode;
            $rootScope.UserDetails.scopeGender = args.Gender;
            $rootScope.AddUser = false;
        }
        //Open modal popup
        var modalInstance = $modal.open({
            templateUrl: 'userModalContent.html',
            controller: 'ModalInstanceCtrl',
            backdrop: 'static',
            size: 'lg',
            resolve: {
                items: function () {
                    return $rootScope.UserDetails;
                }
            }
        });
    };
    
    $rootScope.$$listeners.Role_ChangeEvent = [];
    //make category visible if role is service repr
    $rootScope.$on('Role_ChangeEvent', function (event, args) {
        if (args != undefined) {
            if (args.Code == $rootScope.vmuisettings.ServicerepCode) {
                $rootScope.servrepr = true;
            }
            else {
                $rootScope.servrepr = false;
            }
        }
        else {
            $rootScope.servrepr = false;
        }
      
    });

    //Save user
    $scope.SaveUser = function (obj) {
        if ($scope.UserForm.$valid) {
            var request = {};
            request.FirstName = obj.scopeFirstName == undefined ? "" : obj.scopeFirstName;
            request.MiddleName = obj.scopeMiddleName == undefined ? "" : obj.scopeMiddleName;
            request.LastName = obj.scopeLastName == undefined ? "" : obj.scopeLastName;
            request.Email = obj.scopeEmail == undefined ? "" : obj.scopeEmail;
            request.Password = obj.scopePassword == undefined ? "" : obj.scopePassword;
            request.Status = obj.scopeStatus == undefined ? false : obj.scopeStatus;
            request.Role = obj.scopeRole == undefined ? "" : obj.scopeRole;
            request.DeviceID = obj.scopeDeviceID == undefined ? "" : obj.scopeDeviceID;
            request.UserName = obj.scopeUserName == undefined ? "" : obj.scopeUserName;
            request.MobileNumber = obj.scopeMobileNumber == undefined ? "" : obj.scopeMobileNumber;
            if ($rootScope.servrepr) {
                request.CategoryCode = obj.scopeCategoryCode == undefined ? "" : obj.scopeCategoryCode;
            }
            else {
                request.CategoryCode = "";
            }
            request.Gender = obj.scopeGender == undefined ? "" : obj.scopeGender;
            request.DOB = obj.scopeDOB == undefined ? null : moment(obj.scopeDOB).format("YYYY-MM-DD");
            //request.DOB = obj.scopeDOB == undefined ? null : obj.scopeDOB;
            request.UserID = "1";
            //For address
            var address = {};
            address.StreetLine1 = $scope.UserForm.txtAddressLine1_useraddress.$viewValue;
            address.StreetLine2 = $scope.UserForm.txtAddressLine2_useraddress.$viewValue;
            address.City = $scope.UserForm.txtCity_useraddress.$viewValue;
            address.State = $scope.UserForm.txtState_useraddress.$viewValue;
            address.Country = $scope.UserForm.txtCountry_useraddress.$viewValue;
            address.Pincode = $scope.UserForm.txtZip_useraddress.$viewValue;
            $rootScope.UserAddress = address;

            //For post operation -- New user saving
            if (obj.Id == "0") {
                var Id = "0";
                request.MethodType = "POST";
                request.Id = Id.toString();
            }
                //For Put operation -- Editing user
            else {
                var Id = obj.Code;
                request.MethodType = "PUT";
                request.Code = obj.Code;
                request.Id = obj.Id.toString();
            }
            
            userservice.SaveUser(request, Id, request.MethodType).then(function (res) {
                if (res.Success) {
                    //document upload - starts
                    var requestdoc = {};
                    requestdoc.RequestCode = res.UserObj.Code;
                    requestdoc.RequestType = "User";
                    requestdoc.DocumentType = "ABC123"; //Document type - Profile picture code
                    $rootScope.$emit('SaveDocumentOnSuccess', requestdoc);
                    //On document saved
                    $rootScope.$$listeners.DocumentUploadedSuccessfully = [];
                    $rootScope.$on('DocumentUploadedSuccessfully', function () {
                        $rootScope.$broadcast('profilepicture_uploaded', res.UserObj.Code);
                    });
                    //document upload - ends
                    // Save/Update the address for the user -starts
                    var reqObj = {};
                    reqObj.Address = $rootScope.UserAddress;
                    reqObj.UserID = res.UserObj.Id;
                    reqObj.Status = true;
                    userservice.SaveAddress(reqObj, request.MethodType).then(function (res) {
                        if (res.Success) {
                        }
                        else {
                        }
                    });
                    // Save/Update the address for the user -ends
                    
                    
                    $scope.cancel();
                    noty.add({ type: 'success', body: res.Message });
                    $rootScope.$emit('onSearchUserClicked', $rootScope.requestObj);
                    //To  reload data table and details grid - Starts
                    $rootScope.$on('bindingLookupTable_Success_user', function (event, args) {
                        if ($rootScope.vmuisettings.singlemasterviewclicked) {
                            var JsonResult = res.UserObj;
                            var myObject = $filter('filter')(args, { Code: JsonResult.Code });
                            if (myObject.length > 0) {
                                //Reload view details if document upload success
                                $rootScope.$$listeners.DocumentUploadedSuccessfully = [];
                                $rootScope.$on('DocumentUploadedSuccessfully', function () {
                                    $rootScope.$broadcast('onDetailsViewClicked', myObject[0]);
                                });
                                //Reload view details if document upload failure
                                $rootScope.$$listeners.DocumentUploadFailed = [];
                                $rootScope.$on('DocumentUploadFailed', function () {
                                    $rootScope.$broadcast('onDetailsViewClicked', myObject[0]);
                                });
                                //Reload view details if document is not present for upload
                                $rootScope.$$listeners.FileNotPresent = [];
                                $rootScope.$on('FileNotPresent', function () {
                                    $rootScope.$broadcast('onDetailsViewClicked', myObject[0]);
                                });                                
                            }
                        }
                    });
                    $rootScope.$broadcast('RebindRouteTable_user');
                    //To rebind the profile page ,if user is modified from profile page
                    $rootScope.$broadcast('RebindUserProfilePage');
                    //To  reload data table and details grid - Ends
                }
                else {
                    //$scope.cancel();
                    $timeout(function () {
                        angular.element("#save_userdetails").removeAttr("disabled");
                    }, 0)
                    noty.add({ type: 'danger', body: res.Message });
                }
            });
        }
    }

    //Search User
    $scope.SearchUser = function (obj) {
        if ($scope.UserSearchForm.$valid) {
            var request = {};
            request.RoleCode = obj.SearchType == undefined ? "" : obj.SearchType;
            request.FirstName = obj.SearchName == undefined ? "" : obj.SearchName;
            request.Email = obj.SearchEmail == undefined ? "" : obj.SearchEmail;
            request.MobileNumber = obj.MobileNumber == undefined ? "" : obj.MobileNumber;
            if (obj.DateRange !== undefined) {
                request.StartDate = moment.utc(obj.DateRange.startDate).add('days', '1').format("YYYY-MM-DD");
                request.EndDate = moment.utc(obj.DateRange.endDate).add('days', '1').format("YYYY-MM-DD");
            }
            else {
                if (angular.element("#txtSearchDate_range")[0].value.length > 0) {
                    var dateRange = angular.element("#txtSearchDate_range")[0].value.split('-');
                    var startDate = dateRange[0] + '-' + dateRange[1] + '-' + dateRange[2];
                    request.StartDate = moment.utc(startDate).format("YYYY-MM-DD");
                    var endDate = dateRange[3] + '-' + dateRange[4] + '-' + dateRange[5];
                    request.EndDate = moment.utc(endDate).add('days', '1').format("YYYY-MM-DD");
                }
            }
            $rootScope.requestObj = request;
            $rootScope.$emit('onSearchUserClicked', request);
        }
    }

    $scope.ClearClicked = function () {
        $scope.Details = "";
        $rootScope.$broadcast('clear_dropdown', 'Search_ByType');
    }
    $scope.clearDateRangePicker = function () {
        angular.element("#txtSearchDate_range")[0].value = "";
        $scope.Details.DateRange = undefined;
    }
}]);
