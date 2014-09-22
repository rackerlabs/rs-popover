angular.module('rs.popover').directive('rsPopover', function () {
  'use strict';

  return {
    scope: {
      id: '@',
      attach: '@',
      onOpen: '='
    },
    restrict: 'EA',
    controller: 'PopoverController',
    transclude: true,
    templateUrl: 'rsPopover.html',
    compile: function (element, attributes) {
      attributes.attach = attributes.attach || 'top-left';
    }
  };
});
