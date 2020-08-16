'use strict';

/**
 * @ngdoc service
 * @name core.Services.UtilService
 * @description UtilService Factory
 */


angular
    .module('core')
    .factory('UtilService', ['CONSTANTS', '$http', '$filter', 'localStorageService', '$interval',
        function (CONSTANTS, $http, $filter, localStorageService, $interval) {
            var showDialogBox = function (message, title, buttonName) {
                if (navigator && navigator.notification && navigator.notification.alert) {
                    navigator.notification.alert(message, null, title, buttonName);
                } else {
                    alert(message);
                }
            }

            var confirmBox = function (message, callback, title) {
                if (navigator && navigator.notification && navigator.notification.confirm) {
                    navigator.notification.confirm(message, callback, title);
                } else {
                    var r = confirm(message);
                    if (r) {
                        callback(r);
                    }
                }
            }


            return {
                showError: function (message, title, buttonName) {
                    if (typeof title === 'undefined') {
                        title = 'Whoops';
                    }
                    showDialogBox(message, title, buttonName);
                },

                showDialog: function (message) {
                    showDialogBox(message, "");
                },

                showConfirm: function (message, callback, title) {
                    confirmBox(message, callback, title);
                }
            }
        }
    ]);
