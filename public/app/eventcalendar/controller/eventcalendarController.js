/**

*/
'use strict';
reachApp.controller('eventcalendarcontroller', ['$scope', '$rootScope', '$modal', '$log', '$window', function ($scope, $rootScope, $modal, $log, $window) {
   
    /*To view calendar*/
    $scope.calendarView = 'month';
    $scope.calendarDay = new Date();
    $scope.calendarTitle = moment($scope.calendarDay).format("MMM-YYYY");
    $scope.events = [
        {
            title: 'My event title', // The title of the event
            type: 'Info', // The type of the event (determines its color). Can be important, warning, info, inverse, success or special
            startsAt: new Date(), // A javascript date object for when the event starts
            endsAt: new Date(), // Optional - a javascript date object for when the event ends
            editable: true, // If edit-event-html is set and this field is explicitly set to false then dont make it editable. If set to false will also prevent the event from being dragged and dropped.
            deletable: true, // If delete-event-html is set and this field is explicitly set to false then dont make it deleteable
            incrementsBadgeTotal: true, //If set to false then will not count towards the badge total amount on the month and year view
            recursOn: 'year', // If set the event will recur on the given period. Valid values are year or month
            cssClass: 'a-css-class-name' //A CSS class (or more, just separate with spaces) that will be added to the event when it is displayed on each view. Useful for marking an event as selected / active etc
        },
      {
                    title: 'Test Appointment', // The title of the event
                    type: 'Info', // The type of the event (determines its color). Can be important, warning, info, inverse, success or special
                    startsAt: new Date(), // A javascript date object for when the event starts
                    endsAt: new Date(), // Optional - a javascript date object for when the event ends
                    editable: true, // If edit-event-html is set and this field is explicitly set to false then dont make it editable. If set to false will also prevent the event from being dragged and dropped.
                    deletable: true, // If delete-event-html is set and this field is explicitly set to false then dont make it deleteable
                    incrementsBadgeTotal: true, //If set to false then will not count towards the badge total amount on the month and year view
                    recursOn: 'year', // If set the event will recur on the given period. Valid values are year or month
                    cssClass: 'a-css-class-name' //A CSS class (or more, just separate with spaces) that will be added to the event when it is displayed on each view. Useful for marking an event as selected / active etc
      },
            {
                title: 'Test Appointment 2', // The title of the event
                type: 'Info', // The type of the event (determines its color). Can be important, warning, info, inverse, success or special
                startsAt: new Date("2015-07-19T12:00:00"), // A javascript date object for when the event starts
                endsAt: new Date("2015-07-19T12:30:00"), // Optional - a javascript date object for when the event ends
                editable: true, // If edit-event-html is set and this field is explicitly set to false then dont make it editable. If set to false will also prevent the event from being dragged and dropped.
                deletable: true, // If delete-event-html is set and this field is explicitly set to false then dont make it deleteable
                incrementsBadgeTotal: true, //If set to false then will not count towards the badge total amount on the month and year view
                recursOn: 'year', // If set the event will recur on the given period. Valid values are year or month
                cssClass: 'a-css-class-name' //A CSS class (or more, just separate with spaces) that will be added to the event when it is displayed on each view. Useful for marking an event as selected / active etc
            },
                        {
                            title: 'Test Appointment 3', // The title of the event
                            type: 'Info', // The type of the event (determines its color). Can be important, warning, info, inverse, success or special
                            startsAt: new Date("2015-07-19T12:30:00"), // A javascript date object for when the event starts
                            endsAt: new Date("2015-07-19T13:30:00"), // Optional - a javascript date object for when the event ends
                            editable: true, // If edit-event-html is set and this field is explicitly set to false then dont make it editable. If set to false will also prevent the event from being dragged and dropped.
                            deletable: true, // If delete-event-html is set and this field is explicitly set to false then dont make it deleteable
                            incrementsBadgeTotal: true, //If set to false then will not count towards the badge total amount on the month and year view
                            recursOn: 'year', // If set the event will recur on the given period. Valid values are year or month
                            cssClass: 'a-css-class-name' //A CSS class (or more, just separate with spaces) that will be added to the event when it is displayed on each view. Useful for marking an event as selected / active etc
                        }
    ];

    $scope.SaveEvent = function (o) {
        if ($scope.AddEventForm.$valid) {
            o.type = "Info";
            o.editable = true;
            o.deletable = true;
            $scope.events.push(o);
            $scope.cancel();
        }

    };

    //$rootScope.$on('BindDoctorDetails', function (i,obj) {
     //   $rootScope.DoctorName = obj.name;
    //});

    function showModal(action, event) {
        $modal.open({
            templateUrl: 'deletemodalContent.html',
            controller: 'ModalInstanceCtrl',
            resolve: {
                items: function () {

                }
            }
        });
    }

    //    $scope.eventClicked = function (event) {
    //        showModal('Clicked', event);
    //    };

    $scope.eventEdited = function (event) {
        AddEventModal('Edited', event);
    };

    $scope.eventDeleted = function (event) {
        showModal('Deleted', event);
    };

    //    $scope.eventDropped = function (event) {
    //        showModal('Dropped', event);
    //    };

    $scope.toggle = function ($event, field, event) {
        $event.preventDefault();
        $event.stopPropagation();
        event[field] = !event[field];
    };

    $rootScope.$$listeners.Calendar_Clicked = [];
    $rootScope.$on('Calendar_Clicked', function (i, data) {
        AddEventModal('New', data);
    });

    function AddEventModal(action, event) {
        if (action == "New") {
            $rootScope.EventDetails = {};
            $rootScope.EventModalTitle = "Add Event";
            $rootScope.EventDetails.type = "";
            $rootScope.EventDetails.location = "";
            if ($rootScope.BookAppointmentDetails != undefined) {
                $rootScope.EventDetails.Speciality = $rootScope.BookAppointmentDetails.Speciality;
            }
        }
        else {
            $rootScope.EventModalTitle = "Edit Event";
            $rootScope.EventDetails = event;
            $rootScope.EventDetails.type = event.type;
        }
        $modal.open({
            templateUrl: 'NewEventModal.html',
            controller: 'ModalInstanceCtrl',
            size: 'md',
            resolve: {
                items: function () {
                    return $rootScope.EventDetails;
                }
            }
        });
    }



} ]);

