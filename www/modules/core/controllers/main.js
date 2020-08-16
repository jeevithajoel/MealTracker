'use strict';

/**
 * @ngdoc object
 * @name core.Controllers.MainController
 * @description MainController
 * @requires ng.$scope
*/
angular
	.module('core')
	.controller('MainController', ['$scope', 'UpdateService', 'SurveyService', 'BottleService', 'localStorageService', 'CONSTANTS', 'UsernameService', '$rootScope', 'RunTimesService', 'LocationService', 'usSpinnerService',
		function ($scope, UpdateService, SurveyService, BottleService, localStorageService, CONSTANTS, UsernameService, $rootScope, RunTimesService, LocationService, usSpinnerService) {

			$scope.viewName = "home";
   var LOCAL_STORAGE_BREAKFAST_LIST = "breakfastList";
   var viewHistory = [];

                                $scope.database = null;
                                $scope.getDatabase = function () {
                                return $scope.database;
                                }
                                
                                $scope.setDatabase = function (database) {
                                $scope.database = database;
                                }

			LocationService.turnOnLocation();
			$scope.goHome = function () {
                                $scope.refresh();
                                $scope.setView('home');
			}


                                
  function initDatabase(){
     var myDB = window.sqlitePlugin.openDatabase({name: "mySQLite.db", location: 'default'});
     /*myDB.transaction(function(transaction) {transaction.executeSql('DROP TABLE IF EXISTS FOODORINGREDIENT');});*/
                                
     $scope.setDatabase(myDB);
                                //localStorageService.set("breakfastList", []);
                                //localStorageService.set("lunchList", []);
                                //localStorageService.set("dinnerList", []);
  }
                                
  function getAllFoodIngredients() {
      var Dfrd = $.Deferred();
      $scope.getDatabase().transaction(function(transaction) {transaction.executeSql(
                                                                                                               'SELECT * FROM FOODORINGREDIENT', [], function(tx, results) {
                                                                              Dfrd.resolve(results);
                                                                                                               }, function(error){console.log("ERRRRORRR");
                                                                                                               Dfrd.reject("No data returned");
                                                                                                               });});
                                
                                
                                return Dfrd.promise();
                                }


			$scope.refresh = function (cached) {
				   usSpinnerService.spin('spinner-2');
       initDatabase();
                                
       getAllFoodIngredients().then(
            function (foodIngredients) {
               console.log("FoodIngredients downloaded");
                                    var foodIngredient = [];
                                    var len = foodIngredients.rows.length;
                                    for (var i = 0; i < len; i++) {
                                         var foodIngredientItem = foodIngredients.rows.item(i);
                                         foodIngredient.push(foodIngredientItem);
                                    }
               localStorageService.set("foodIngredient",foodIngredient);
            }, function (error) {
               console.log("Downloading FoodIngredients failed :(")
            }
       );
				
			};
		
			$scope.setView = function (viewName) {
				viewHistory.push($scope.viewName);
				$scope.viewName = viewName;
			}

			$scope.goBack = function () {
				   $scope.viewName = viewHistory.pop();
			}

			$scope.getView = function () {
				   var page = "";
       switch ($scope.viewName) {
          case "home":
                page = "modules/core/views/Home.html";
                break;
          case "foodIngredient":
                page = "modules/core/views/food-ingredient.html";
                break;
          case "addFoodIngredient":
                page = "modules/core/views/add-food-ingredient.html";
                break;
          case "meal":
                page = "modules/core/views/meal.html";
                break;
          case "mealSearchAndAdd":
                page = "modules/core/views/meal-searchAndAdd.html";
                break;
					     default:
						          page = "modules/core/views/Home.html";
				   }

       return page;
			};

			$scope.fieldInvalid = function (field) {
				return field.$dirty && field.$invalid
			}
		}


	]);
