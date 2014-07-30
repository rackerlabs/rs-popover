angular.module('rs.popover').directive('rsPopoverForm', function () {
  'use strict';

  return {
    scope: {
      id: '@',
      label: '=',
      onOpen: '=',
      onSave: '='
    },
    restrict: 'EA',
    controller: 'PopoverController',
    transclude: true,
    templateUrl: 'rsPopoverForm.html'
  };
});
