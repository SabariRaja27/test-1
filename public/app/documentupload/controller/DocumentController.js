/**
Document related functionalities -- Adding/Cancelling/Uploading is done here
*/
'use strict';
reachApp.controller('documentcontroller', ['$scope', '$rootScope', '$modal', 'store', '$upload', '$http', 'noty', '$timeout', 'documentService', 'underscore', '$location',
function ($scope, $rootScope, $modal, store, $upload, $http, noty, $timeout, documentService, _, $location) {
    //$scope.uploader = new FileUploader();
    //how to use in html
    //<vm-title title-value="Address" style-value="info alert-info" icon="fa fa-plus" text-value="Add" control-id="UserDocumentAdd"></vm-title>   
    //<section data-ng-include=" 'app/views/directiveTemplates/documentUpload/documentUploadGrid.html' ">
    $rootScope.noty = noty;
    var loggedonuserinfo = store.get('loggedonuser');

    //View controls -- strats
    $scope.ViewDocumentActionButtons = true;

    $rootScope.$on('disbaledocumentactions', function (e, i) {
        $scope.ViewDocumentActionButtons = i;
    });
    //View controls  - strats

    //Delete the grid on click of delete icon
    $scope.delete = function (obj, file) {
        obj.target.closest('tr').remove();
        obj.target.closest('tr').setAttribute('class', 'ng-hide');
        var request = {};
        request.docid = file.id;
        documentService.DeleteDocument(request).then(function (res) {
            if (res.Success) {
                var filesafterdeleting = _.filter($rootScope.Allfiles, function (item) {
                    return item.id != file.id;
                });
                $rootScope.Allfiles = filesafterdeleting;
                $rootScope.$broadcast('AcceptOneDocument_OnCancel', file);
                noty.add({ type: 'success', body: res.Message });
                //$rootScope.$emit('BindToDocumentGrid', res.aaData.DocumentDetails);
            }
            else {
            }
        });
    }
    $scope.download = function (obj) {

    }

    //done to prevent multiple instances of an event from getting created
    $rootScope.$$listeners.SaveDocumentOnSuccess = [];
    //Event called on Click of Save to upload document to DB with RequestCode
    $rootScope.$on('SaveDocumentOnSuccess', function (i, requestdata) {
        if ($rootScope.Allfiles != undefined && $rootScope.Allfiles.length != 0) {
            $scope.upload($rootScope.Allfiles, requestdata);
        }
        else {
            $rootScope.$broadcast('FileNotPresent', null);
        }
    });

    $scope.filesadded = [];

    $scope.username = "Test User";
    $scope.$watch('files', function () {
        if ($scope.files != null) {
            //  if ($scope.rejFiles.length == 0) {
            if ($scope.files.length > 0) {
                $scope.files[0].choppedfilename = chopdetails($scope.files[0].name, 0, 20);
                $scope.files[0].userID = loggedonuserinfo.Id;
                //before pushing the file, check whether it exists in global variable
                var isExists = false;
                angular.forEach($scope.filesadded, function (item) {
                    if (item.name == $scope.files[0].name) {
                        isExists = true;
                    }
                });
                if (!isExists) {
                    //push the file to local array
                    $scope.filesadded.push($scope.files[0]);
                    $scope.currentfileAdded_name = $scope.files[0].name;
                    $scope.currentfileAdded = $scope.files[0];
                    $scope.currentfileAdded.id = 0;
                    $rootScope.$broadcast('ImageAdded', $scope.files);
                    //$scope.upload($scope.files);

                } else {
                    alert("File already exists, please upload another file");
                }
            }
            //}
            //else {
            //    alert("Please upload either .xls or .xlsx document");
            //}
        }
    });

    //Event called to clearDocument
    $rootScope.$on('ClearDocumentGrid', function () {
        $scope.clearDocument();
    });

    $scope.clearDocument = function () {
        $rootScope.file = "";
        $rootScope.Allfiles = [];
        angular.element(document.querySelector('#tbl_document')).addClass('ng-hide');
    };

    //cancel the document
    $scope.cancelDocument = function (event, fi) {
        //if ($rootScope.file.name == fi.name) {
        //  $rootScope.file = "";
        var filesafterdeleting = _.filter($rootScope.Allfiles, function (item) {
            return (item.name != fi.name);
        });
        //var filesaftercancelling = _.filter($scope.files, function (item) {
        //    return (item.name != fi.name);
        // });
        // $scope.files = filesaftercancelling;
        $rootScope.Allfiles = filesafterdeleting;
        event.target.closest('tr').setAttribute('class', 'ng-hide');
        $rootScope.$broadcast('AcceptOneDocument_OnCancel', fi);
        //  }
        //this.file - refers to current row
        //$scope.filesadded.splice($scope.filesadded.indexOf(fi), 1);
    };



    //upload the document
    $scope.upload = function (file, documentcode) {
        var documentcode = { 'request': documentcode };
        //console.log($scope.documentUploadFields);
        $upload.upload({
            url: $rootScope.vmuisettings.PROTONAPIURL + 'api/Upload',
            file: file,
            fields: documentcode,
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
            //}).progress(function (evt) {
            //var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            //console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
        }).success(function (data, status, headers, config) {
            if (data.Success == false) {
                noty.add({ type: 'danger', body: data.Message });
                $rootScope.$broadcast('DocumentUploadFailed', data);
                $scope.filesadded = [];
            }
            else {
                $rootScope.$broadcast('DocumentUploadedSuccessfully', data);
                //noty.add({ type: 'success', body: data.aaData.Message });
                $scope.filesadded = [];
                $scope.clearDocument();
                console.log('file ' + config.file.name + 'uploaded. Response: ' + data);
            }
        }).error(function (data, status, headers, config) {
            console.log('file ' + config.file.name + 'upload failed. Response: ' + data);
            $scope.filesadded = [];
        });

    };


    //truncates the document
    function chopdetails(str, start, end) {
        var chopdata = str;

        if (str.length > end) {
            var chopdata = str.substring(start, end);
            chopdata = chopdata + "...";
        }
        return chopdata;
    }
    $rootScope.$on('BindToDocumentGrid', function (i, docfile) {
        var arr = [];
        for (var i = 0; i < docfile.length; i++) {
            var file = {};
            file = docfile[i];
            file.name = docfile[i].FileName;
            file.choppedfilename = chopdetails(docfile[i].FileName, 0, 20);
            file.Tooltipname = docfile[i].FileName.replace(/(.{20})/g, "$1\n");
            file.id = docfile[i].Id;
            file.RequestType = $location.path().split('/')[1];
            file.RequestCode = docfile[i].RequestCode;
            arr.push(file);
        }
        $timeout(function () {
            $scope.BinddocumentGrid(arr, docfile[0].RequestCode);
        }, 500);

        //$rootScope.file = docfile;
    });
    //adds the document to the grid
    $scope.BinddocumentGrid = function (file, requestCode) {
        $("#tbl_document").removeClass('ng-hide');
        $("#tbl_document tbody tr").removeClass('ng-hide');
        if ($rootScope.Allfiles.length != 0) {
            $rootScope.Allfiles = _.filter($rootScope.Allfiles, function (doc) {
                return ((doc.RequestType.toLowerCase() == $location.path().split('/')[1].toLowerCase()) && (doc.RequestCode == requestCode));
            });
        }

        $rootScope.Allfiles = file;


        //console.log($rootScope.file);
        //console.log($rootScope.file.name);
    }

    //adds the document to the grid
    $scope.addTodocumentGrid = function (file) {
        //Ranjan-Adding a new line after every 20 characters to bind the tooltip properly as if there was no space between the name, tooltip was not displaying properly
        var Tooltipname = file.name.replace(/(.{20})/g, "$1\n");
        file.Tooltipname = Tooltipname;
        $rootScope.file = file;
        if ($rootScope.Allfiles == undefined || $rootScope.Allfiles.length == 0) {
            $rootScope.Allfiles = [];
        }
        else {
            $rootScope.Allfiles = _.filter($rootScope.Allfiles, function (doc) {
                return (doc.RequestType.toLowerCase() == $location.path().split('/')[1].toLowerCase());
            });
        }
        file.RequestType = $location.path().split('/')[1];
        $("#tbl_document").removeClass('ng-hide');
        $("#tbl_document tbody tr").removeClass('ng-hide');
        $rootScope.Allfiles.push(file);
        $rootScope.$broadcast('AcceptOneDocument', file);
    }

    //set the profile picture document to the scope variable
    $scope.$on('HoldProfilePicture', function (e, i) {
        $rootScope.Allfiles = [];
        $rootScope.Allfiles.push(i);
        $rootScope.$broadcast('AcceptOneDocument', i);
    });

    //Initiating File Accept Type - Starts
    $scope.FileAcceptType = "";
    if ($scope.$parent != null) {
        //If FileAcceptType is passed then assign it to Scope variable
        if ($scope.$parent.items != undefined && $scope.$parent.items.FileAcceptType != undefined) {
            $scope.FileAcceptType = $scope.$parent.items.FileAcceptType;
        }
    }
    //Initiating File Accept Type - Ends
}]);