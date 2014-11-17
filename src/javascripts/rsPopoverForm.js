angular.module('rs.popover').directive('rsPopoverForm', function () {
  'use strict';

  return {
    scope: {
      id: '@',
      saveLabel: '@',
      cancelLabel: '@',
      onOpen: '=',
      onSave: '='
    },
    restrict: 'EA',
    controller: 'PopoverController',
    controllerAs: 'ctrl',
    transclude: true,
    templateUrl: 'rsPopoverForm.html'
  };
});
