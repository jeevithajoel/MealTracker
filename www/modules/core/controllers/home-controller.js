'use strict';

/**
 * @ngdoc object
 * @name core.Controllers.HomeController
 * @description HomeController
 * @requires ng.$scope
*/
angular
    .module('core')
    .controller('HomeController', [
        '$scope', '$filter', 'localStorageService', 'CONSTANTS', 'SurveyService', 'UpdateService',
        'BarcodeService', '$timeout', 'UtilService', 'RunTimesService', '$rootScope', 'usSpinnerService',
        function ($scope, $filter, localStorageService, CONSTANTS, SurveyService, UpdateService,
            BarcodeService, $timeout, UtilService, $rootScope) {

            $scope.refresh = function (cached) {
                $scope.spVerified = false;
                $scope.spOverridden = false;
                $scope.$parent.refresh(cached);
            }

            $scope.addRecord = function (name,quantity,unit,weight,calories,carbs,protein,fat,fibre) {
                //alert("adding fodd ingredientss"+ calories);

                                           $scope.getDatabase().transaction(function(transaction) {
                                                            var executeQuery = "INSERT INTO FOODORINGREDIENT (name, quantity,unit,weight,calories, carbs,protein,fat,fibre) VALUES (?, ?, ?,?, ?, ?, ?, ?, ?)";
                                                            transaction.executeSql(executeQuery, [name, quantity, unit,weight,calories,carbs,protein,fat,fibre], function(tx, result) {
                                                                                   alert('Inserted');
                                                                                   },
                                                                                   function(error) {
                                                                                   alert('Error occurred');
                                                                                   });
                                                            });
                $scope.setView('foodIngredient');
            }
                                           

            $scope.enterSurveyId = function () {
                $scope.addRecord($scope.name,$scope.quantity,$scope.unit,$scope.weight,$scope.calories,$scope.carbs, $scope.protein,$scope.fat,$scope.fibre);
            }
                                   
                                  

        }
    ]);
