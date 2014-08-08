angular.module('rs.popover').directive('rsPopoverForm', function ($timeout) {
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
        $timeout(function () {
          var focusable;

          focusable = element.find(':input').first();
          focusable.focus();
        }, 0, false);
      });
    }
  };
});
