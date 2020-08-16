'use strict';

/**
 * @ngdoc service
 * @name core.Services.SurveyService
 * @description SurveyService Factory
 */


angular
    .module('core')
    .factory('RunTimesService', ['CONSTANTS', '$http', '$filter', '$q', 'localStorageService', '$rootScope',
        function (CONSTANTS, $http, $filter, $q, localStorageService, $rootScope) {

            return {
                getRunTimes: getRunTimes,
                checkStability: checkStability,
                getNextRunTime: getNextRunTime
            }

            function checkStability(fridgeLocation, bottles) {
                var deferred = $q.defer();
                if (fridgeLocation) {
                    //get the fridge barcode components
                    getRunTimes(true).then(function (data) {
                        if (data) {
                            var nextRunTime = getNextRunTime(fridgeLocation, data);
                            if (nextRunTime) {
                                var result = {
                                    nextRunTime: nextRunTime,
                                    failedBottles: []
                                }
                                for (var i = 0; i < bottles.length; i++) {
                                    if (bottles[i].status == 'T') {
                                        var diff = nextRunTime.getTime() - bottles[i].dateTaken;
                                        if (!(((diff / 1000) / 60) / 60 <= 24)) {
                                            result.failedBottles.push(bottles[i]);
                                        }
                                    }
                                }
                            } else {
                                deferred.reject("Unknown fridge reference");
                            }
                            deferred.resolve(result);
                        }
                    });
                }
                return deferred.promise;
            }

            function getRunTimeForDayAndRun(d, rtd) {
                var now = new Date(d.getTime());
                var setRT = function (time, hrsMins) {
                    hrsMins = hrsMins.split(":");
                    time.setHours(hrsMins[0]);
                    time.setMinutes(hrsMins[1]);
                }
                var doTime = null;
                if (now.getDay() == 0 || now.getDay() == 6) {
                    doTime = rtd.satSun;
                } else {
                    doTime = rtd.monFri;
                }
                if (!doTime) {
                    if (now.getDay() == 0 || now.getDay() == 1) {
                        doTime = rtd.sunMon;
                    } else {
                        doTime = rtd.tueSat;
                    }
                }
                setRT(now, doTime);
                return now;
            }


            function getNextRunTime(location, runTimes) {
                var runTimeData;

                for (var key in runTimes) {
                    if (runTimes.hasOwnProperty(key)) {
                        var site = runTimes[key];
                        if (site[0].siteName.toUpperCase().substring(0, 4) == location.toUpperCase()) {
                            runTimeData = site;
                            break;
                        }
                    }
                }
                if (runTimeData) {
                    var now = new Date();
                    for (var j = 0; j < 2; j++) {
                        var bestNextRunDate;
                        for (var i = 0; i < runTimeData.length; i++) {
                            var nextRunDate = getRunTimeForDayAndRun(now, runTimeData[i]);
                            if (nextRunDate.getTime() >= (new Date()).getTime()) {
                                //return nextRunDate;
                                if (!bestNextRunDate || nextRunDate.getTime() < bestNextRunDate.getTime()) {
                                    bestNextRunDate = new Date(nextRunDate.getTime());
                                }
                            }
                        }
                        if (bestNextRunDate) {
                            return bestNextRunDate;
                        }
                        now.setDate(now.getDate() + 1);
                    }
                }
            }

            function getRunTimes(useCached) {

//                console.log("RunTimesService.getRunTimes() Called");



                var deferred = $q.defer();

                if (useCached) {
                    deferred.resolve(localStorageService.get('runTimesCache'));
                }


                var req = {
                    method: 'GET',
                    url: CONSTANTS.GET_RUNTIMES_URL + "?random=" + new Date().getTime(),
                    headers: {
                        'Content-Type': 'application/json',
                        'X-STW-ApplicationID': CONSTANTS.APPLICATION_ID,
                        'X-STW-OrganisationID': CONSTANTS.ORGANISATION_ID,
                        'X-STW-Username': $rootScope.username,
                        'X-STW-DeviceID': 'iOS',
                        'X-Requested-With': 'SurveySampler'
                    },
                    //timeout: 10
                }

                var cachedRunTimes = localStorageService.get('runTimesCache');

                $http(req).then(
                    function successCallback(response) {
                        if (response && response.data) {
//                            console.log("Got latest run times from server, updating cache");
                            localStorageService.set('runTimesCache', response.data);
                            deferred.resolve(response.data);
                        } else {
                            if (cachedRunTimes) {
//                                console.log("No data returned so using cached run times");
                                deferred.resolve(cachedRunTimes);
                            } else {
//                                console.log("No data returned and no cached run times");
                                deferred.reject("No data returned");
                            }
                        }
                    },
                    function errorCallback(response) {
                        if (cachedRunTimes) {
//                            console.log("Connection error - returning cached run times");
                            deferred.resolve(cachedRunTimes);
                        } else {
//                            console.log("Connection error and no cached run times.");
                            deferred.reject("Failed with status " + response.status);
                        }
                    });

                return deferred.promise;
            };
        }







    ]);
