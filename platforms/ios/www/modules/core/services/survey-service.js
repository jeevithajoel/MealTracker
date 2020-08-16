'use strict';

/**
 * @ngdoc service
 * @name core.Services.SurveyService
 * @description SurveyService Factory
 */


angular
    .module('core')
    .factory('SurveyService', ['CONSTANTS', '$http', '$filter', '$q', 'localStorageService', '$rootScope',
        function (CONSTANTS, $http, $filter, $q, localStorageService, $rootScope) {

            return {
                getSurveys: getSurveys,
                getTakenSamples: getTakenSamples,
                getSamplePoints: getSamplePoints
            }

            function getSamplePoints() {
                console.log("SurveyService.getSamplePoints() Called");

                var deferred = $q.defer();

                var req = {
                    method: 'GET',
                    url: CONSTANTS.GET_SAMPLEPOINTS_URL + "?random=" + new Date().getTime(),
                    headers: {
                        'Content-Type': 'application/json',
                        'X-STW-ApplicationID': CONSTANTS.APPLICATION_ID,
                        'X-STW-OrganisationID': CONSTANTS.ORGANISATION_ID,
                        'X-STW-Username': $rootScope.username,
                        'X-STW-DeviceID': 'iOS',
                        'X-Requested-With': 'SurveySampler'
                    },
                    timeout: 60000
                }

                var cachedSamplePoints = localStorageService.get('samplePointsCache');

                $http(req).then(
                    function successCallback(response) {
                        if (response && response.data) {
                            console.log("Got latest sample points from server, updating cache");
                            localStorageService.set('samplePointsCache', response.data);
                            deferred.resolve(response.data);
                        } else {
                            if (cachedSamplePoints) {
                                console.log("No data returned so using cached sample points");
                                deferred.resolve(cachedSamplePoints);
                            } else {
                                console.log("No data returned and no cached sample points");
                                deferred.reject("No data returned");
                            }
                        }
                    },
                    function errorCallback(response) {
                        if (cachedSamplePoints) {
                            console.log("Connection error - returning cached sample points");
                            deferred.resolve(cachedSamplePoints);
                        } else {
                            console.log("Connection error and no cached sample points.");
                            deferred.reject("Failed with status " + response.status);
                        }
                    });

                return deferred.promise;
            }

            function getTakenSamples(username) {
                console.log("SurveyService.getTakenSamples() Called");

                var deposits = {
                    takenSamples: [],
                    bottleCount: 0
                };

                if (username) {
                    username = username.toLowerCase();
                    //var takenSamples = [];

                    var surveys = localStorageService.get('surveysCache');
                    if (surveys) {
                        for (var i = 0; i < surveys.length; i++) {
                            var survey = surveys[i];
                            if (survey.samples) {
                                for (var j = 0; j < survey.samples.length; j++) {
                                    var sample = survey.samples[j];
                                    var depositSample = false;
                                    for (var k = 0; k < sample.sampleBottles.length; k++) {
                                        var sampleBottle = sample.sampleBottles[k];
                                        if (sampleBottle.username) {
                                            if (sampleBottle.status == 'T' && sampleBottle.username.toLowerCase() == username) {
                                                sample.courierDestination = survey.courierDestination;
                                                //takenSamples.push(sample);
                                                //continue start;
                                                depositSample = true;
                                                deposits.bottleCount++;
                                            }
                                        }
                                    }
                                    if (depositSample) {
                                        deposits.takenSamples.push(sample);
                                    }
                                }
                            }
                        }
                    }
                }
                return deposits;
            }

            function getSurveys(cached, surveyIds) {
                console.log("SurveyService.getSurveys() Called");

                var deferred = $q.defer();

                if (!surveyIds || surveyIds.length == 0) {
                    console.log("Emptying cache of surveys");
                    localStorageService.set('lastUpdated', new Date());
                    localStorageService.set('surveysCache', []);
                    deferred.resolve([]);
                }

                var req = {
                    method: 'GET',
                    url: CONSTANTS.GET_SURVEYS_URL + "?surveyIds=" + surveyIds.join() + "&random=" + new Date().getTime(),
                    headers: {
                        'Content-Type': 'application/json',
                        'X-STW-ApplicationID': CONSTANTS.APPLICATION_ID,
                        'X-STW-OrganisationID': CONSTANTS.ORGANISATION_ID,
                        'X-STW-Username': $rootScope.username,
                        'X-STW-DeviceID': 'iOS',
                        'X-Requested-With': 'SurveySampler'
                    },
                    timeout: 60000
                }

                var cachedSurveys = localStorageService.get('surveysCache');

                if (!cached) {
                    $http(req).then(
                        function successCallback(response) {
                            if (response && response.data) {
                                console.log("Got latest surveys from server, update cache");
                                localStorageService.set('lastUpdated', new Date());
                                localStorageService.set('surveysCache', response.data);
                                deferred.resolve(response.data);
                            } else {
                                if (cachedSurveys) {
                                    console.log("No data returned so using cached surveys");
                                    deferred.resolve(cachedSurveys);
                                } else {
                                    console.log("No data returned and no cached surveys");
                                    deferred.reject("No data returned");
                                }
                            }
                        },
                        function errorCallback(response) {
                            if (cachedSurveys) {
                                console.log("Connection error - returning cached surveys");
                                deferred.resolve(cachedSurveys);
                            } else {
                                console.log("Connection error and no cached surveys.");
                                deferred.reject("Failed with status " + response.status);
                            }
                        });
                } else {
                    deferred.resolve(cachedSurveys);
                }

                return deferred.promise;
            };
        }







    ]);
