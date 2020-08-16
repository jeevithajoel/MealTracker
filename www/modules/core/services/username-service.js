'use strict';

/**
 * @ngdoc service
 * @name core.Services.UsernameService
 * @description UsernameService Factory
 */


angular
    .module('core')
    .factory('UsernameService', ['CONSTANTS', '$http', '$filter', '$q',
        function (CONSTANTS, $http, $filter, $q) {

            return {
                /**
                 * @ngdoc function
                 * @name core.Services.UsernameService#method1
                 * @methodOf core.Services.UsernameService
                 * @return
                 */
                getUsername: function () {

                    console.log("UsernameService.getUsername() Called");

                    var deferred = $q.defer();

                    if (window.cordova && window.cordova.airwatch) {
                        console.log("Getting Airwatch details");
                            
                        window.cordova.airwatch.getUsername(function (username) {
                            console.log("Airwatch details retrieved");
                            console.log(username);
                            if (username) {
                                var username = username.replace("stwater\\", "");
                                deferred.resolve(username);
                            } else {
                                deferred.reject("Username not found");
                            }
                        }, function (error) {
                                deferred.reject("Error " + error);
                        });
                                 
//                        window.cordova.airwatch.getDetails(function (details) {
//                            console.log("Airwatch details retrieved");
//                            console.log(details);
//                            if (details && details.username) {
//                                var username = details.username.replace("stwater\\", "");
//                                deferred.resolve(username);
//                            } else {
//                                deferred.reject("Username not found");
//                            }
//                        }, function (error) {
//                            deferred.reject("Error " + error);
//                        });
                    } else {
                        //running locally so using test username (user)
                        deferred.resolve("user", "v1.0");
                    }

                    return deferred.promise;
                }
            };
        }]);
