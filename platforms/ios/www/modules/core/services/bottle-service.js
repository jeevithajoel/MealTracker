'use strict';

/**
 * @ngdoc service
 * @name core.Services.BottleService
 * @description BottleService Factory
 */


angular
    .module('core')
    .factory('BottleService', ['CONSTANTS', '$http', '$filter', '$q',
        function (CONSTANTS, $http, $filter, $q) {

            return {
                enrichBottleData: enrichBottleData,
                getBottleData: getBottleData
            }

            function enrichBottleData(bottleData, bottle) {
                for (var i = 0; i < bottleData.length; i++) {
                    if (bottleData[i].code == bottle.code) {
                        bottle.bottleData = bottleData[i];
                        break;
                    }
                }
            }

            /**
             * @ngdoc function
             * @name core.Services.BottleService#method1
             * @methodOf core.Services.BottleService
             * @return
             */
            function getBottleData() {

                var deferred = $q.defer();

//                console.log("BottleService.getBottleData() Called");

                var req = {
                    method: 'GET',
                    url: CONSTANTS.BOTTLE_JSON,
                }

                $http(req).then(
                    function successCallback(response) {
                        deferred.resolve(response.data.items);
                    },
                    function errorCallback(response) {
                        console.log("getBottleData failed");
//                        console.log(response.data);
                        deferred.reject("getBottleData failed");
                    }
                );

                return deferred.promise;

            }
        }]);
