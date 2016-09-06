'use strict';

/**
 * @ngdoc directive
 * @name jessMakesThingsApp.directive:PictureBox
 * @description
 * # PictureBox
 */
angular.module('jessMakesThingsApp')
.directive('pictureBox', function ($compile) {
    return {
        restrict: 'EA',
        scope: {
            modalContent: '='
        },
        controller: function ($scope) {
            var ZOOM_MAX = 10, ZOOM_MIN = -10;
            $scope.pictureBox = {
                isOpen: false,
                zoom: 0,
                image:{
                    element: null,
                    actual: {
                        width: 0,
                        height: 0
                    },
                    display: {
                        width: 'auto',
                        height: 'auto'
                    }
                },
                wrapper:{
                    element: null,
                    width: 0,
                    height: 0
                }
            };
            var pictureBox = $scope.pictureBox;

            pictureBox.close = function () {
                console.log("click popover");
                $('.picture-box.overlay').remove();
                $('body').removeClass('picture-box-open');
                pictureBox.isOpen = false;
            };

            pictureBox.open = function () {
                console.log("click picture");
                var body = $('body');
                body.append(pictureBox.popover);
                body.addClass('picture-box-open');

                pictureBox.image.element = $('.image', pictureBox.popover);
                pictureBox.wrapper.element = $('.image-wrapper', pictureBox.popover);

                $(pictureBox.image.element).ready( function () {
                    loadImageDimensions();
                    loadWrapperDimensions();
                    autoResize();
                    $(pictureBox.wrapper.element).resize( function () {
                        loadWrapperDimensions();
                        if (pictureBox.zoom === 0){
                            autoResize();
                        }
                    })
                });

                $('.picture-box.overlay').click( function () {
                    pictureBox.close();
                });
                $('.picture-box .image-wrapper').click( function () {
                    pictureBox.close();
                });
                $('.picture-box .image').click( function (event) {
                    event.stopPropagation();
                });
            };

            function loadImageDimensions () {
                pictureBox.image.actual.width = pictureBox.image.element.width();
                pictureBox.image.actual.height = pictureBox.image.element.height();
                pictureBox.image.display = pictureBox.image.actual;
            }

            function loadWrapperDimensions () {
                pictureBox.wrapper.width = pictureBox.wrapper.element.width();
                pictureBox.wrapper.height = pictureBox.wrapper.element.height();
            }

            function autoResize() {
                while ((pictureBox.image.display.width > pictureBox.wrapper.width) ||
                    (pictureBox.image.display.height > pictureBox.wrapper.height)) {
                    var success = zoomOut();
                    if(!success){ //max zoom reached
                        return;
                    }
                }
            }

            function zoomIn(){
                if (pictureBox.zoom < ZOOM_MAX){
                    pictureBox.zoom++;
                    applyZoom();
                    return true;
                }
                return false;
            }

            function zoomOut(){
                if (pictureBox.zoom > ZOOM_MIN) {
                    pictureBox.zoom--;
                    applyZoom();
                    return true;
                }
                return false;
            }

            function applyZoom () {
                var adjustment = pictureBox.image.actual.width * (pictureBox.zoom/10);
                pictureBox.image.display.width = pictureBox.image.actual.width + adjustment;
                adjustment = pictureBox.image.actual.height * (pictureBox.zoom/10);
                pictureBox.image.display.height = pictureBox.image.actual.height + adjustment;
                $scope.$apply();
            }

            function isLandscape () {
                return (pictureBox.image.actual.width > pictureBox.image.actual.height);
            }
        },
        link: function postLink (scope, element) {
            var image = $('img', element);
            $(image).click(scope.pictureBox.open);

            //create modal html
            var imgSrc = image.attr('src');
            var html = '<div class="picture-box overlay">' +
                '<i class="glyphicon glyphicon-remove close-icon"></i>' +
                '<div class="image-wrapper">' +
                '<div class="image-wrapper-inner">' +
                '<img class="image" src="'+imgSrc+'" width="{{pictureBox.image.display.width}}" height="{{pictureBox.image.display.height}}">' +
                '</div></div></div>';
            scope.pictureBox.popover = $compile(html)(scope);
        }
    };
});
