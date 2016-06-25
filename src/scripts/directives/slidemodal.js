'use strict';

/**
 * @ngdoc directive
 * @name jessMakesThingsApp.directive:SlideModal
 * @description
 * # SlideModal
 */
angular.module('jessMakesThingsApp')
.directive('slideModal', function () {
    return {
        templateUrl: 'slideModal.html',
        restrict: 'EA',
        scope: {
            modalContent: '='
        },
        controller: function ($scope, $timeout) {
            $scope.slideModal = {};
            $scope.slideModal.isOpen = false;
            $scope.slideModal.content = null;
            function open() {
                $($scope.slideModal.element).removeClass('closed').addClass('open');
            }

            $scope.slideModal.close = function () {
                $scope.slideModal.isOpen = false;
                $($scope.slideModal.element).removeClass('open').addClass('closing');
                $timeout(function () {
                    $($scope.slideModal.element).removeClass('closing').addClass('closed');
                    $scope.slideModal.content = null;
                }, 700);
            };

            $scope.$on('openModal', function (event, args) {
                $scope.slideModal.isOpen = true;
                $scope.slideModal.content = args.content;
                open();
            });

        },
        link: function postLink(scope, element) {
            scope.slideModal.element = $('.slide-modal', element)[0];

            //bind close events
            $(element).click(scope.slideModal.close);

            //prevent clicks inside the modal calling close
            $('.modal-content', element).click(function(event){
                event.stopPropagation();
            });
        }
    };
});
