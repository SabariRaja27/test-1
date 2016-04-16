'use strict';
reachApp.factory('noty', ['$rootScope', function ($rootScope) {
    var queue = [];

    return {
        queue: queue,
        add: function (item) {
            queue.push(item);
            setTimeout(function () {
                $('#notyMessage').toggleClass('in');
            }, 10);
            setTimeout(function () {
                $('#notyMessage').toggleClass('in');
                $('.alerts .alert').eq(0).remove();
                queue.shift();
            }, 3000);

            //            setTimeout(function () {
            //                // remove the alert after 2000 ms
            //                $('.alerts .alert').eq(0).remove();
            //                queue.shift();
            //            }, 3000);
        },
        pop: function () {
            return this.queue.pop();
        }
    };
} ])