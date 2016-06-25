/**
 * @ngdoc service
 * @name jessMakesThingsApp.contentService
 * @description
 * # contentService
 * Service in the jessMakesThingsApp.
 */
angular.module('jessMakesThingsApp')
  .service('contentService', function ($http, $q) {
        'use strict';

        this.getPosts = function () {
            var deferred = $q.defer();

            $.getJSON('assets/posts.json', function (json) {
                deferred.resolve(json);
            });

            return deferred.promise;
        };
    });

