'use strict';

/**
 * @ngdoc service
 * @name core.Services.BarcodeService
 * @description BottleService Factory
 */


angular
    .module('core')
    .factory('BarcodeService', ['CONSTANTS', '$http', '$filter', '$q',
        function (CONSTANTS, $http, $filter, $q) {

            return {
                /**
                 * @ngdoc function
                 * @name core.Services.BarcodeService#method1
                 * @methodOf core.Services.BarcodeService
                 * @return
                 */
                getBarcodeData: function (useCamera) {

                    var deferred = $q.defer();

                    if (useCamera) {
                        cordova.plugins.barcodeScanner.scan(
                            function (result) {
                                console.log("We got a barcode\n" +
                                    "Result: " + result.text + "\n" +
                                    "Format: " + result.format + "\n" +
                                    "Cancelled: " + result.cancelled);
                                if (result && result.text) {
                                    deferred.resolve(result.text);
                                } else {
                                    deferred.reject("No data returned");
                                }

                            },
                            function (error) {
                                deferred.reject("Scanning failed because " + error);
                            },
                                                            {
                                                            preferFrontCamera : false, // iOS and Android
                                                            showFlipCameraButton : false, // iOS and Android
                                                            showTorchButton : true, // iOS and Android
                                                            torchOn: true, // Android, launch with the torch switched on (if available)
                                                            saveHistory: true, // Android, save scan history (default false)
                                                            prompt : "Place a barcode inside the scan area", // Android
                                                            resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
                                                            orientation : "landscape", // Android only (portrait|landscape), default unset so it rotates with the device
                                                            disableAnimations : true, // iOS
                                                            disableSuccessBeep: false // iOS and Android
                                                            }
                        );
                    } else {
                        console.log("Not using barcode scanner");

                        if (navigator.notification) {
                            function onPrompt(results) {
                                if (results.buttonIndex == 1 && results.input1) {
                                    deferred.resolve(results.input1);
                                } else {
                                    deferred.reject("Cancelled");
                                }
                            }

                            navigator.notification.prompt(
                                'Please enter barcode',     // message
                                onPrompt,                   // callback to invoke
                                'Barcode',                  // title
                                ['Ok', 'Cancel'],            // buttonLabels
                                ''                          // defaultText
                            );
                        } else {
                            var bc = prompt("Please enter barcode", '');
                            if (bc) {
                                deferred.resolve(bc);
                            } else {
                                deferred.reject("Cancelled");
                            }
                        }


                    }

                    return deferred.promise;


                }
            };
        }]);
