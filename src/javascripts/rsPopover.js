angular.module('rs.popover').directive('rsPopover', function () {
  'use strict';

  return {
    scope: {
      id: '@',
      onOpen: '='
    },
    restrict: 'EA',
    controller: 'PopoverController',
    transclude: true,
    templateUrl: 'rsPopover.html'
  };
});
