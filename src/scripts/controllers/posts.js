/**
 * @ngdoc function
 * @name jessMakesThingsApp.controller:PostsCtrl
 * @description
 * # PostsCtrl
 * Controller of the jessMakesThingsApp
 */
angular.module('jessMakesThingsApp')
  .controller('PostsCtrl', function ($scope, $rootScope, contentService) {
        'use strict';
        $scope.postCtrl ={};
        $scope.postCtrl.blog = {};
        $scope.postCtrl.posts = {};
        $scope.postCtrl.placeholders = [];

        $scope.postCtrl.postIconClicked = function(post){
            $rootScope.$broadcast('openModal', {content:post});
        }

        contentService.getPosts().then(function(data){
            $scope.postCtrl.posts = data.posts;
            //create placeholders
             $scope.postCtrl.createPlaceholders($scope.postCtrl.placeholders, $scope.postCtrl.posts.length);

        });


        $scope.postCtrl.createPlaceholders = function(placeholderArray, length){
            var placeholdersRequired = 3 - (length % 3);
            for(var x=0; x<placeholdersRequired; x++){
                placeholderArray.push(x);
            }
        };
  });
