angular.module('rs.popover').directive('rsPopoverForm', function () {
  'use strict';

  return {
    scope: {
      id: '@',
      attach: '@',
      saveLabel: '@',
      cancelLabel: '@',
      onOpen: '=',
      onSave: '='
    },
    restrict: 'EA',
    controller: 'PopoverController',
    transclude: true,
    templateUrl: 'rsPopoverForm.html',
    compile: function (element, attributes) {
      attributes.attach = attributes.attach || 'top-left';
    }
  };
});
