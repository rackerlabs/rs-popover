angular.module('rs.popover').directive('rsPopoverForm', function ($timeout, focus) {
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
    transclude: true,
    templateUrl: 'rsPopoverForm.html',
    link: function (scope, element) {
      scope.state.on('load', function () {
        focus(element);
      });
    }
  };
});
