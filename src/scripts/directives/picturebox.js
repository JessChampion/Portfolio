'use strict';

/**
 * @ngdoc directive
 * @name jessMakesThingsApp.directive:PictureBox
 * @description
 * # PictureBox
 */
angular.module('jessMakesThingsApp')
.directive('pictureBox', function () {
    return {
        restrict: 'EA',
        scope: {
            modalContent: '='
        },
        controller: function ($scope, $timeout) {
            $scope.pictureBox = {};
            $scope.pictureBox.isOpen = false;


            $scope.pictureBox.close = function () {
                console.log("click popover");
                $('.picture-box.overlay').remove();
                $('body').removeClass('picture-box-open');
                $scope.pictureBox.isOpen = false;
            };

            $scope.pictureBox.open = function () {
                console.log("click picture");
                var body = $('body');
                body.append($scope.pictureBox.popover);
                body.addClass('picture-box-open');

                $('.picture-box.overlay').click(function () {
                    $scope.pictureBox.close();
                });
                $('.picture-box .image-wrapper').click(function () {
                    $scope.pictureBox.close();
                });
                $('.picture-box .image').click(function (event) {
                    event.stopPropagation();
                });
            };
        },
        link: function postLink (scope, element) {
            scope.pictureBox.image = $('img', element);
            $(scope.pictureBox.image).click(scope.pictureBox.open);

            //create modal html
            var imgSrc = scope.pictureBox.image.attr('src');
            scope.pictureBox.popover = '<div class="picture-box overlay">' +
                '<div class="image-wrapper"><i class="glyphicon glyphicon-remove close-icon"></i>' +
                '<div class="image-wrapper-inner">' +
                '<img class="image" src="'+imgSrc+'"></div></div></div>';
        }
    };
});
