'use strict';

/**
 * @ngdoc service
 * @name core.Services.LocationService
 * @description LocationService Factory
 */


angular
    .module('core')
    .factory('LocationService', ['CONSTANTS', '$http', '$filter', '$q', 'UtilService',
        function (CONSTANTS, $http, $filter, $q, UtilService) {


            return {

                turnOnLocation: function () {
//                    console.log("LocationService.turnOnLocation() Called");
                    var deferred = $q.defer();
                    if (window.cordova && navigator && navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(
                            function (position) {
                                console.log("Location service is on");
                                deferred.resolve();
                            },
                            function (error) {
                                console.log("LocationService not avialable");
                                if (confirm("Please turn on the device's location service in the App Settings")) {
                                    window.cordova.plugins.diagnostic.switchToSettings(function() {
                                       console.log("Successfully switched to Settings app");
                                    }, function(error) {
                                        console.log("The following error occurred: ", error);
                                    });
                                }

//                                 alert("Please turn on the device's location service in the App Settings");
//                                 cordova.dialogGPS("Please turn on the device's location service.", null, function (buttonIndex) {
//                                                                               // if(buttonIndex==0){
//                                                                                  //UtilService.showError("Unable to continue without GPS.");
//                                                                                  //navigator.app.exitApp();
//                                                                                  //}
//                                                                });

                                deferred.reject("Location service not available");
                            },
                            { timeout: 5000, enableHighAccuracy: true }
                        )
                    } else {
                        deferred.resolve();
                    }
                    return deferred.promise;
                },

                /**
                 * @ngdoc function
                 * @name core.Services.LocationService#method1
                 * @methodOf core.Services.LocationService
                 * @return
                 */
                getLocation: function () {

                    console.log("LocationService.getLocation() Called");

                    var deferred = $q.defer();

                    if (window.cordova && navigator && navigator.geolocation) {

                        var coords = {
                            latitude: "0",
                            longitude: "0"
                        }
                        var nullPosition = {};

                        nullPosition.coords = coords;

                        navigator.geolocation.getCurrentPosition(
                            function (position) {
                                console.log("We got the position\n" +
                                    'Latitude: ' + position.coords.latitude + '\n' +
                                    'Longitude: ' + position.coords.longitude + '\n' +
                                    'Altitude: ' + position.coords.altitude + '\n' +
                                    'Accuracy: ' + position.coords.accuracy + '\n' +
                                    'Altitude Accuracy: ' + position.coords.altitudeAccuracy + '\n' +
                                    'Heading: ' + position.coords.heading + '\n' +
                                    'Speed: ' + position.coords.speed + '\n' +
                                    'Timestamp: ' + position.timestamp + '\n');
                                if (position) {
                                    deferred.resolve(position);
                                } else {
                                    //deferred.reject("Location not found");
                                    console.log("Location not found");
                                    deferred.resolve(nullPosition);
                                }

                            },
                            function (error) {
                                // cordova.dialogGPS("Please turn on the device's location service and retry.",null,function(buttonIndex){
                                //   if(buttonIndex==0){
                                //     UtilService.showError("Unable to continue without GPS.");
                                //   }
                                // });
                                // deferred.reject("Location service not available");
                                console.log("Location service not available");
                                deferred.resolve(nullPosition);
                            },
                            { timeout: 5000, enableHighAccuracy: true }
                        );
                    } else {
//                        console.log("Location service not available - using test coords");
                        var coords = {
                            latitude: "123456",
                            longitude: "654321"
                        }
                        var position = {};

                        position.coords = coords;

                        deferred.resolve(position);
                    }

                    return deferred.promise;
                }
            };
        }]);
