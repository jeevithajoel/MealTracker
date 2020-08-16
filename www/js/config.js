'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function () {
    // Init module configuration options
    var applicationModuleName = 'angularjsapp';
    var applicationModuleVendorDependencies = [
        'ngResource',
        'ngCookies',
        'ngAnimate',
        'ngTouch',
        'ngSanitize',
        'ui.router',
        'ui.bootstrap',
        'ui.utils',
        'LocalStorageModule',
        'ngBootbox',
        'checklist-model',
        'naif.base64',
        'angularSpinner'
    ];

    // Add a new vertical module
    var registerModule = function (moduleName) {
        // Create angular module
        angular
            .module(moduleName, ['pr.longpress']);

        // Add the module to the AngularJS configuration file
        angular
            .module(applicationModuleName)
            .requires
            .push(moduleName);
    };

                                var CONSTANTS = {
                                        //Pre-Prod URLs
                                    GET_SURVEYS_URL:"http://10.242.26.34:6050/SurveySampler/1/quis/rest/surveys.json",
                                    GET_SAMPLEPOINTS_URL:"http://10.242.26.34:6050/SurveySampler/1/quis/rest/samplePoints.json",
                                    GET_RUNTIMES_URL:"http://10.242.26.34:6050/SurveySampler/1/quis/rest/runTimes.json",
                                    POST_BOTTLE_URL:"http://10.242.26.34:6050/SurveySampler/1/quis/rest/bottle.json",
                                    POST_FIELDDET_URL:"http://10.242.26.34:6050/SurveySampler/1/quis/rest/fieldDet.json",
                                    POST_SAMPLE_URL:"http://10.242.26.34:6050/SurveySampler/1/quis/rest/dropOffSample.json",
                                                   
                                    //Production URLs
                                    //  GET_SURVEYS_URL:"http://10.242.26.179:7842/SurveySampler/1/quis/rest/surveys.json",
                                    //  GET_SAMPLEPOINTS_URL:"http://10.242.26.179:7842/SurveySampler/1/quis/rest/samplePoints.json",
                                    //  GET_RUNTIMES_URL:"http://10.242.26.179:7842/SurveySampler/1/quis/rest/runTimes.json",
                                    //  POST_BOTTLE_URL:"http://10.242.26.179:7842/SurveySampler/1/quis/rest/bottle.json",
                                    //  POST_FIELDDET_URL:"http://10.242.26.179:7842/SurveySampler/1/quis/rest/fieldDet.json",
                                    //  POST_SAMPLE_URL:"http://10.242.26.179:7842/SurveySampler/1/quis/rest/dropOffSample.json",

                            //        GET_SURVEYS_URL: "http://localhost:80/rest/surveys.json",  //dev
                            //        GET_SAMPLEPOINTS_URL: "http://localhost:80/rest/samplePoints.json",  //dev
                            //        GET_RUNTIMES_URL: "http://localhost:80/rest/runTimes.json",
                            //        POST_BOTTLE_URL: "http://localhost:80/rest/bottle.json",
                            //        POST_FIELDDET_URL: "http://localhost:80/rest/fieldDet.json",
                            //        POST_SAMPLE_URL: "http://localhost:80/rest/dropOffSample.json",
                                                            
                                BOTTLE_JSON: "res/data/bottles.json",
                                LOCAL_STORAGE_CUSTOMER_TAP_KEY: "localStorageCustomerTapKey",
                                LOCAL_STORAGE_FOOD_INGREDIENT: "foodIngredient",
                                POLLING_INTERVAL_CONNECTED: 30000,
                                POLLING_INTERVAL_DISCONNECTED: 180000,
                                APPLICATION_ID: 'UXVpc0xpdGVTUw==',
                                ORGANISATION_ID: 'STW1'
                                }

    return {
        applicationModuleName: applicationModuleName,
        applicationModuleVendorDependencies: applicationModuleVendorDependencies,
        registerModule: registerModule,
        CONSTANTS: CONSTANTS
    };
})();
