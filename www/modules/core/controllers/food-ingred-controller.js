'use strict';

/**
 * @ngdoc object
 * @name core.Controllers.FoodIngredientController
 * @description FoodIngredientController
 * @requires ng.$scope
 */
angular
.module('core')
.controller('FoodIngredientController', [
                                         '$scope', '$filter', 'localStorageService', 'CONSTANTS', 'BottleService',
                                         '$rootScope', 'BarcodeService', 'LocationService', 'UpdateService',
                                         function ($scope, $filter, localStorageService, CONSTANTS, BottleService,
                                                   $rootScope, BarcodeService, LocationService, UpdateService) {
                                         
     $scope.foodIngredient;
                                      
     $scope.viewIndFoodIngredient = function (name) {
         alert(name);
     }
                                         
     $scope.getFoodIngredient = function () {
         if(!$scope.foodIngredient){
             getAllItems();
         }
         console.log(" return:::" + $scope.foodIngredient.length);
         return $scope.foodIngredient;
     }
                                         
     function getAllItems(){
         var foodIngredients = localStorageService.get("foodIngredient");
         var len = foodIngredients.length;
                                         
         for(var i = 0; i < len; i++) {
             var foodIngredientItem = {};
             foodIngredientItem = foodIngredients[i];
             $scope.setFoodIngredient(foodIngredientItem);
         }
         
     }
     $scope.setFoodIngredient = function (foodIngredientItem) {
            if (!$scope.foodIngredient) {
               $scope.foodIngredient = [];
            }
                                         
            $scope.foodIngredient.push(foodIngredientItem);
     }
                                        
                                         
     }
     ]);

