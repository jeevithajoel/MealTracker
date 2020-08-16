'use strict';

angular
    .module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

angular
    .module(ApplicationConfiguration.applicationModuleName)
    .config(['$locationProvider',
        function ($locationProvider) {
            $locationProvider.hashPrefix('!');
        }
    ])
    .config(['localStorageServiceProvider',
        function (localStorageServiceProvider) {
            localStorageServiceProvider.setPrefix('survey');
        }
    ])
    .constant('CONSTANTS', ApplicationConfiguration.CONSTANTS);


angular.element(document).ready(function () {

});

//Then define the init function for starting up the application
angular
    .element(document)
    .ready(function () {
        //     if (window.location.hash === '#_=_') {
        //         window.location.hash = '#!';
        //     }
        //     angular
        //         .bootstrap(document,
        //             [ApplicationConfiguration.applicationModuleName]);
        //

        if (window.cordova) {
            console.log("Running in Cordova, will bootstrap AngularJS once 'deviceready' event fires.");
            console.log("Running in Phonegap, will bootstrap AngularJS once 'deviceready' event fires.");

            document.addEventListener('deviceready', function () {
                console.log("Deviceready event has fired, bootstrapping AngularJS.");
                angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
                                      initDatabase();
            }, false);
        } else {
            console.log("Running in browser, bootstrapping AngularJS now.");
            angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
        }


    });


document.addEventListener("deviceready", function () {
                          screen.orientation.lock('portrait');
                          }, false);
function initDatabase(){
 var myDB = window.sqlitePlugin.openDatabase({name: "mySQLite.db", location: 'default'});
 /*myDB.transaction(function(transaction) {
  transaction.executeSql('DROP TABLE IF EXISTS FOODORINGREDIENT');
  });*/
 myDB.transaction(function(transaction) {
                  transaction.executeSql('CREATE TABLE IF NOT EXISTS FOODORINGREDIENT (id integer primary key, name text, quantity number,unit text,weight number,calories number,carbs number, protein number, fat number, fibre number)', [],
                                         function(tx, result) {
                                         console.log("Table created successfully");
                                         },
                                         function(error) {
                                         alert("Error occurred while creating the table.");
                                         });
                  });
 $scope.setDatabase(myDB);
 }
