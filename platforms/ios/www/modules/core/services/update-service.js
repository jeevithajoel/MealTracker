'use strict';

/**
 * @ngdoc service
 * @name core.Services.UpdateService
 * @description UpdateService Factory
 */


angular
    .module('core')
    .factory('UpdateService', ['CONSTANTS', '$http', '$filter', 'localStorageService', '$interval', 'LocationService', '$rootScope', '$q',
        function (CONSTANTS, $http, $filter, localStorageService, $interval, LocationService, $rootScope, $q) {

            var LOCAL_STORAGE_BOTTLE_UPDATES_KEY = "bottleUpdates";
            var LOCAL_STORAGE_FIELD_UPDATES_KEY = "fieldUpdates";
            var LOCAL_STORAGE_SAMPLE_UPDATES_KEY = "sampleUpdates";

            var online = true;

            var applyBottleUpdate = function (bottle) {
                var bottleUpdates = getPending().bottleUpdates;
                if (bottleUpdates) {
                    for (var i = 0; i < bottleUpdates.length; i++) {
                        if (bottleUpdates[i].bottleId == bottle.bottleId) {
                            bottle.status = bottleUpdates[i].status;
                            bottle.skipComment = bottleUpdates[i].skipComment;
                            break;
                        }
                    }
                }
            }

            var applyDetUpdate = function (det, sampleNumber) {
                var fieldUpdates = getPending().fieldUpdates;
                if (fieldUpdates) {
                    for (var i = 0; i < fieldUpdates.length; i++) {
                        if (fieldUpdates[i].detCode == det.detCode && fieldUpdates[i].sampleNumber == sampleNumber) {
                            det.TXT_RESULT = fieldUpdates[i].TXT_RESULT;
                            det.status = fieldUpdates[i].status;
                            det.skipComment = fieldUpdates[i].skipComment;
                            break;
                        }
                    }
                }
            }

            var getPending = function () {
                return {
                    bottleUpdates: localStorageService.get(LOCAL_STORAGE_BOTTLE_UPDATES_KEY),
                    fieldUpdates: localStorageService.get(LOCAL_STORAGE_FIELD_UPDATES_KEY),
                    sampleUpdates: localStorageService.get(LOCAL_STORAGE_SAMPLE_UPDATES_KEY)
                }
            }

            var populateUpdateWithCustomerTapDetails = function (update) {
                var customerTapDetails = localStorageService.get(CONSTANTS.LOCAL_STORAGE_CUSTOMER_TAP_KEY);
                if (customerTapDetails) {
                    update.address = customerTapDetails.address;
                    update.postcode = customerTapDetails.postcode;
                    update.telephone = customerTapDetails.phone;
                    update.custName = customerTapDetails.name;
                    update.sourceType = customerTapDetails.sourceType;
                    update.tapLocation = customerTapDetails.tapLocation;
                    update.tapLocationOther = (update.tapLocation == 'Other' || (update.sourceType == 'Seepage Water' || update.sourceType == 'STW Sample Point') ? customerTapDetails.tapLocationOther : '')
                    update.bowserTankerRef = (update.sourceType == 'Bowser/Tanker' ? customerTapDetails.bowserTankerRef : '')
                    update.shareDetails = customerTapDetails.shareDetails;
                    update.sampleDesc = customerTapDetails.sampleDesc;
                    update.sapNumber = customerTapDetails.sapNumber;
                }
            }

            var getCount = function () {
                var bottleUpdates = localStorageService.get(LOCAL_STORAGE_BOTTLE_UPDATES_KEY);
                var fieldUpdates = localStorageService.get(LOCAL_STORAGE_FIELD_UPDATES_KEY);
                var sampleUpdates = localStorageService.get(LOCAL_STORAGE_SAMPLE_UPDATES_KEY);
                var sum = 0;
                if (bottleUpdates) {
                    sum += bottleUpdates.length;
                }
                if (fieldUpdates) {
                    sum += fieldUpdates.length;
                }
                if (sampleUpdates) {
                    sum += sampleUpdates.length;
                }
                return sum;
            }

            var sendBottleUpdate = function (req, update) {
                $http(req).then(
                    function successCallback(response) {
                        cancelAllUpdates();
                    });
            }

            var sendDetUpdate = function (req, update) {
                $http(req).then(
                    function successCallback(response) {
                        cancelAllFieldUpdates();
                    });
            }

            var sendSampleUpdate = function (req, update) {
                $http(req).then(
                    function successCallback(response) {
                        cancelAllSampleUpdates();
                    });
            }

            var sendUpdates = function () {

                var req = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-STW-ApplicationID': CONSTANTS.APPLICATION_ID,
                        'X-STW-OrganisationID': CONSTANTS.ORGANISATION_ID,
                        'X-STW-Username': $rootScope.username,
                        'X-STW-DeviceID': 'iOS',
                        'X-Requested-With': 'SurveySampler'
                    }
                }
                var pendingBottles = localStorageService.get(LOCAL_STORAGE_BOTTLE_UPDATES_KEY);
                if (pendingBottles && pendingBottles.length > 0) {
                    req.url = CONSTANTS.POST_BOTTLE_URL;
                    req.data = JSON.stringify(pendingBottles);
                    sendBottleUpdate(req, pendingBottles);
                }
                var pendingDets = localStorageService.get(LOCAL_STORAGE_FIELD_UPDATES_KEY);
                if (pendingDets && pendingDets.length > 0) {
                    req.url = CONSTANTS.POST_FIELDDET_URL;
                    req.data = JSON.stringify(pendingDets);
                    sendDetUpdate(req, pendingDets);
                }
                var pendingSamples = localStorageService.get(LOCAL_STORAGE_SAMPLE_UPDATES_KEY);
                if (pendingSamples && pendingSamples.length > 0) {
                    req.url = CONSTANTS.POST_SAMPLE_URL;
                    req.data = JSON.stringify(pendingSamples);
                    sendSampleUpdate(req, pendingSamples);
                }
            }

            var timer;

            var restartTimer = function () {
                //stopTimer();
                startTimer();
            }


            var startTimer = function () {

                if (!angular.isDefined(timer)) {
                    timer = $interval(function () {
                        sendUpdates();
                    }, CONSTANTS.POLLING_INTERVAL_CONNECTED);
                }

                var BackgroundFetch = window.BackgroundFetch;

                // Your background-fetch handler.
                var fetchCallback = function() {
                    console.log('[js] BackgroundFetch event received');
                    sendUpdates();
                    // Required: Signal completion of your task to native code
                    // If you fail to do this, the OS can terminate your app
                    // or assign battery-blame for consuming too much background-time
                    BackgroundFetch.finish();
                };

                var failureCallback = function(error) {
                    console.log('- BackgroundFetch failed', error);
                };

                BackgroundFetch.configure(fetchCallback, failureCallback, {
                    minimumFetchInterval: 15, // <-- default is 15
                    stopOnTerminate: false,   // <-- Android only
                    startOnBoot: true,        // <-- Android only
                    forceReload: true         // <-- Android only
                });



            }

            var stopTimer = function () {
                if (angular.isDefined(timer)) {
                    $interval.cancel(timer);
                }
            }

            var cancelAllUpdates = function () {
                localStorageService.set(LOCAL_STORAGE_BOTTLE_UPDATES_KEY, []);
            }


            var cancelUpdate = function (bottle, selectedSample) {
                var updates = localStorageService.get(LOCAL_STORAGE_BOTTLE_UPDATES_KEY);
                for (var i = 0; i < updates.length; i++) {
                    if (updates[i].bottleId == bottle.bottleId) {
                        updates.splice(i, 1);
                        i--;
                    }
                }
                localStorageService.set(LOCAL_STORAGE_BOTTLE_UPDATES_KEY, updates);
                if (selectedSample) {
                    var bottles = selectedSample.sampleBottles;
                    for (var i = 0; i < bottles.length; i++) {
                        if (bottles[i].bottleId == bottle.bottleId) {
                            bottles[i].status = 'U';
                            bottles[i].skipComment = '';
                            break;
                        }
                    }
                }
            }

            var cancelAllFieldUpdates = function () {
                localStorageService.set(LOCAL_STORAGE_FIELD_UPDATES_KEY, []);
            }

            var cancelFieldUpdate = function (fieldUpdate) {
                var fieldUpdates = localStorageService.get(LOCAL_STORAGE_FIELD_UPDATES_KEY);
                for (var i = 0; i < fieldUpdates.length; i++) {
                    if (fieldUpdates[i].sampleNumber == fieldUpdate.sampleNumber && fieldUpdates[i].detCode == fieldUpdate.detCode) {
                        fieldUpdates.splice(i, 1);
                        //i--;
                        break;
                    }
                }
                localStorageService.set(LOCAL_STORAGE_FIELD_UPDATES_KEY, fieldUpdates);
            }

            var cancelAllSampleUpdates = function () {
                localStorageService.set(LOCAL_STORAGE_SAMPLE_UPDATES_KEY, []);
                localStorageService.set('deposits', []);
            }

            var cancelSampleUpdate = function (sampleUpdate) {
                var sampleUpdates = localStorageService.get(LOCAL_STORAGE_SAMPLE_UPDATES_KEY);
                for (var i = 0; i < sampleUpdates.length; i++) {
                    if (sampleUpdates[i].sampleNumber == sampleUpdate.sampleNumber) {
                        sampleUpdates.splice(i, 1);
                        //i--;
                        break;
                    }
                }
                localStorageService.set(LOCAL_STORAGE_SAMPLE_UPDATES_KEY, sampleUpdates);
            }

            return {

                startUpdates: restartTimer,

                cancelSampleUpdate: cancelSampleUpdate,
                cancelFieldUpdate: cancelFieldUpdate,
                cancelUpdate: cancelUpdate,

                getCount: function () {
                    return getCount();
                },

                getPending: function () {
                    return getPending();
                },

                applyUpdates: function (surveys) {
                    //update bottles
                    if ((getPending().bottleUpdates && getPending().bottleUpdates.length > 0) || (getPending().fieldUpdates && getPending().fieldUpdates.length > 0)) {
                        for (var i = 0; i < surveys.length; i++) {
                            if(surveys[i].samples){
                                for (var j = 0; j < surveys[i].samples.length; j++) {
                                    if (surveys[i].samples[j].sampleBottles) {
                                        for (var k = 0; k < surveys[i].samples[j].sampleBottles.length; k++) {
                                            applyBottleUpdate(surveys[i].samples[j].sampleBottles[k]);
                                        }
                                    }
                                    if (surveys[i].samples[j].fieldDets) {
                                        for (var k = 0; k < surveys[i].samples[j].fieldDets.length; k++) {
                                            applyDetUpdate(surveys[i].samples[j].fieldDets[k], surveys[i].samples[j].sampleNumber);
                                        }
                                    }
                                }
                            }
                        }
                    }
                },



                dropOffSample: function (sample, id, username) {
                    var deferred = $q.defer();
                    LocationService.getLocation().then(
                        function (position) {
                            var sampleUpdates = localStorageService.get(LOCAL_STORAGE_SAMPLE_UPDATES_KEY);
                            if (!sampleUpdates) {
                                sampleUpdates = [];
                            }

                            var sampleUpdate = {};

                            var sampleExists = false;
                            for (var i = 0; i < sampleUpdates.length; i++) {
                                if (sampleUpdates[i].sampleNumber == sample.sampleNumber) {
                                    sampleExists = true;
                                    sampleUpdate = sampleUpdates[i];
                                    break;
                                }
                            }

                            sampleUpdate.sampleNumber = sample.sampleNumber;
                            sampleUpdate.fridgeCode = id;
                            sampleUpdate.fridgeDate = new Date().getTime();
                            sampleUpdate.username = username;
                            sampleUpdate.fridgeLatitude = position.coords.latitude;
                            sampleUpdate.fridgeLongitude = position.coords.longitude;
                            if (!sampleExists) {
                                sampleUpdates.push(sampleUpdate);
                            }
                            localStorageService.set(LOCAL_STORAGE_SAMPLE_UPDATES_KEY, sampleUpdates);
                            deferred.resolve();
                        },
                        function (reason) {
                            deferred.reject(reason)
                        }
                    )

                    return deferred.promise;
                },

                updateFieldDet: function (fieldDetUpdate) {
                    populateUpdateWithCustomerTapDetails(fieldDetUpdate);
                    if (fieldDetUpdate) {
                        var fieldUpdates = localStorageService.get(LOCAL_STORAGE_FIELD_UPDATES_KEY);
                        if (!fieldUpdates) {
                            fieldUpdates = [];
                        }

                        var exists = false;
                        for (var i = 0; i < fieldUpdates.length; i++) {
                            if (fieldUpdates[i].sampleNumber == fieldDetUpdate.sampleNumber && fieldUpdates[i].detCode == fieldDetUpdate.detCode) {
                                fieldUpdates[i] = fieldDetUpdate;
                                exists = true;
                                break;
                            }
                        }
                        if (!exists) {
                            fieldUpdates.push(fieldDetUpdate);
                        }

                        localStorageService.set(LOCAL_STORAGE_FIELD_UPDATES_KEY, fieldUpdates);
                    }
                },



                updateBottle: function (bottleUpdate) {

                    console.log("updateBottle service called");
                    populateUpdateWithCustomerTapDetails(bottleUpdate);
                    //bottleUpdate.timestamp = Date();

                    var updates = localStorageService.get(LOCAL_STORAGE_BOTTLE_UPDATES_KEY);
                    if (!updates) {
                        updates = [];
                    }

                    var exists = false;
                    for (var i = 0; i < updates.length; i++) {
                        if (updates[i].bottleId == bottleUpdate.bottleId) {
                            updates[i] = bottleUpdate;
                            exists = true;
                        }
                    }

                    if (!exists) {
                        updates.push(bottleUpdate);
                        var deposits = localStorageService.get('deposits') || [];
                        for (var i = 0; i < updates.length; i++) {
                            if (deposits.indexOf(updates[i].sampleNumber) === -1) {
                                deposits.push(updates[i].sampleNumber);
                            }
                        }
                        localStorageService.set('deposits', deposits);
                    }
                    localStorageService.set(LOCAL_STORAGE_BOTTLE_UPDATES_KEY, updates);
                }
            }

        }]);
