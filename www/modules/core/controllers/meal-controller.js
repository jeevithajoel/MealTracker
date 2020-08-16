'use strict';

/**
 * @ngdoc object
 * @name core.Controllers.MealController
 * @description MealController
 * @requires ng.$scope
 */
angular
.module('core')
.controller('MealController', [
            '$scope', '$filter', 'localStorageService', 'CONSTANTS', 'BottleService',
            '$rootScope', 'BarcodeService', 'LocationService', 'UpdateService',
     function ($scope, $filter, localStorageService, CONSTANTS, BottleService,
              $rootScope, BarcodeService, LocationService, UpdateService) {
                               
                               
     $scope.foodIngredOptions = [];
     $scope.selected = false;
     $scope.selectedFoodItem = {};
     var arrBreakfast = [];
     var arrLunch = [];
     var arrDinner = [];
     $scope.breakfastCalories;
     $scope.lunchCalories;
     $scope.dinnerCalories;
                               $scope.totalCalories = 0;
     $scope.totalCarbs = 0;
     $scope.totalProtein = 0;
     $scope.totalFibre = 0;
     $scope.totalFat = 0;
                               $scope.carb_percentage = 100;
                               $scope.prot_percentage = 100;
                               $scope.fat_percentage = 100;
                               $scope.fibre_percentage = 100;
                               $scope.cal_intake = 1500;
                               var carb_intake = 200;
                               var prot_intake = 75;
                               var fat_intake = 53;
                               var fibre_intake = 33;
     
                               
     $scope.getArrBreakfast = function () {
         if(!this.arrBreakfast){
           $scope.getList('breakfastList');
         }
         return this.arrBreakfast;
     }
                               
     $scope.setArrBreakfast = function (item) {
         if (!this.arrBreakfast) {
            this.arrBreakfast = [];
         }
         this.arrBreakfast.push(item);
     }

                               
     $scope.getArrLunch = function () {
         if(!this.arrLunch){
            $scope.getList('lunchList');
         }
         return this.arrLunch;
     }
                               
     $scope.setArrLunch = function (item) {
         if (!this.arrLunch) {
            this.arrLunch = [];
         }
         this.arrLunch.push(item);
     }
                               
     $scope.getArrDinner = function () {
         if(!this.arrDinner){
            $scope.getList('dinnerList');
         }
         return this.arrDinner;
    }
                               
    $scope.setArrDinner = function (item) {
        if (!this.arrDinner) {
           this.arrDinner = [];
        }
        this.arrDinner.push(item);
    }
    
    $scope.initList = function () {
       $scope.getArrBreakfast();
       $scope.getArrLunch();
       $scope.getArrDinner();
                               $scope.carb_percentage = (($scope.totalCarbs/carb_intake)*100).toFixed(2);
                               $scope.prot_percentage = (($scope.totalProtein/prot_intake)*100).toFixed(2);
                               $scope.fat_percentage = (($scope.totalFat/fat_intake)*100).toFixed(2);
                               $scope.fibre_percentage = (($scope.totalFibre/fibre_intake)*100).toFixed(2);
    }
                               $scope.removeItem = function (index) {
                               alert('wwww');
                                    $scope.arrBreakfast.splice(index, 1);
                               };
    $scope.removeFoodItem = function (key, type) {
                               alert('removeFood' + key);
                               if(type == 'breakfast'){
                                   var breakfastList = localStorageService.get("breakfastList");
                                   breakfastList.splice(key,1);
                                   localStorageService.set("breakfastList", breakfastList);
                               }else if(type == 'lunch'){
                                   var lunchList = localStorageService.get("lunchList");
                                   lunchList.splice(key,1);
                                   localStorageService.set("lunchList", lunchList);
                               }else{
                                   var dinnerList = localStorageService.get("dinnerList");
                                   dinnerList.splice(key,1);
                                   localStorageService.set("dinnerList", dinnerList);
                               }
                               location.reload();
                               //$scope.setView('meal');
    }

     $scope.refresh = function () {
         var foodIngredients = localStorageService.get("foodIngredient");
         var len = foodIngredients.length;
                               
         for(var i = 0; i < len; i++) {
            var obj = {
                  id: foodIngredients[i].name,
                  name: foodIngredients[i].name
             };
             $scope.foodIngredOptions.push(obj);
         }
                               
     }
                               
     $scope.setSelectedItem = function (foodItem) {
         $scope.selected = true;
                               
         var foodIngredients = localStorageService.get("foodIngredient");
         var len = foodIngredients.length;
         for(var i = 0; i < len; i++) {
             if(foodItem == foodIngredients[i].name){
                 $scope.selectedFoodItem = foodIngredients[i];
                 $scope.quantity = foodIngredients[i].quantity;
                 $scope.unit = foodIngredients[i].unit;
                 $scope.weight = foodIngredients[i].weight;
                 $scope.calories = foodIngredients[i].calories;
                 $scope.carbs = foodIngredients[i].carbs;
                 $scope.protein = foodIngredients[i].protein;
                 $scope.fat = foodIngredients[i].fat;
                 $scope.fibre = foodIngredients[i].fibre;
             }
         }
     }
                               
     $scope.searchAndAdd = function (type) {
         localStorageService.set("type", type);
         $scope.setView('mealSearchAndAdd');
     }
                               
     $scope.addMeal = function () {
         updateMealList();
         localStorageService.set("type", '');
         $scope.setView('meal');
     }
                               
     function updateMealList() {
        if(localStorageService.get("type") == 'breakfast'){
             var breakfastList = localStorageService.get("breakfastList");
             if (!breakfastList) {
                breakfastList = [];
             }
             $scope.selectedFoodItem.key = breakfastList.length;
             breakfastList.push($scope.selectedFoodItem);
             localStorageService.set("breakfastList", breakfastList);
        }else if(localStorageService.get("type") == 'lunch'){
            var lunchList = localStorageService.get("lunchList");
            if (!lunchList) {
                 lunchList = [];
            }
            $scope.selectedFoodItem.key = lunchList.length;
            lunchList.push($scope.selectedFoodItem);
            localStorageService.set("lunchList", lunchList);
        }else{
            var dinnerList = localStorageService.get("dinnerList");
            if (!dinnerList) {
               dinnerList = [];
            }
            $scope.selectedFoodItem.key = dinnerList.length;
            dinnerList.push($scope.selectedFoodItem);
            localStorageService.set("dinnerList", dinnerList);
        }
     }
                               
                              
     $scope.getList = function (list) {
         //localStorageService.set("breakfastList", []);
         var lstType = localStorageService.get(list);
         if(lstType && lstType.length > 0){
            var totCalories=0; var totCarb=0; var totProt=0; var totFat=0; var totFibre=0;
            for (var i = 0; i<lstType.length; i++) {
                var item = {};
                if(lstType[i].name){
                   item.name = lstType[i].name;
                   item.quantity = lstType[i].quantity;
                   item.calories = lstType[i].calories;
                               item.key = lstType[i].key;
                   totCalories = totCalories + item.calories;
                   totCarb = totCarb + lstType[i].carbs;
                   totProt = totProt + lstType[i].protein;
                   totFat = totFat + lstType[i].fat;
                   totFibre = totFibre + lstType[i].fibre;
                }
                if(list == 'breakfastList'){
                   $scope.breakfastCalories = totCalories;
                   $scope.setArrBreakfast(item);
                }else if(list == 'lunchList'){
                   $scope.lunchCalories = totCalories;
                   $scope.setArrLunch(item);
                }else{
                   $scope.dinnerCalories = totCalories;
                   $scope.setArrDinner(item);
                }
                              
            }
                               $scope.totalCalories = $scope.totalCalories + totCalories;
                               $scope.totalCarbs = $scope.totalCarbs + totCarb;
                               $scope.totalProtein = $scope.totalProtein + totProt;
                               $scope.totalFat = $scope.totalFat + totFat;
                               $scope.totalFibre = $scope.totalFibre + totFibre;
         }else{
            if(list == 'breakfastList'){
               this.arrBreakfast = [];
               this.arrBreakfast.length=0;
            }else if(list == 'lunchList'){
               this.arrLunch = [];
               this.arrLunch.length=0;
            }else{
               this.arrDinner = [];
               this.arrDinner.length=0;
            }

         }
     }
                               
                              
     }
     ]);

