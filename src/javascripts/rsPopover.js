angular.module('rs.popover').directive('rsPopover', function () {
  'use strict';

  return {
    scope: {
      id: '@',
      onOpen: '='
    },
    restrict: 'EA',
    controller: 'PopoverBaseController',
    controllerAs: 'ctrl',
    transclude: true,
    templateUrl: 'rsPopover.html'
  };
});
