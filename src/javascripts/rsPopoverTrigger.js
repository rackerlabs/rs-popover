angular.module('rs.popover').directive('rsPopoverTrigger', function (registry) {
  'use strict';

  return {
    restrict: 'A',
    require: '?^rsPopover',
    link: function (scope, element, attrs, popoverController) {
      var id;

      if (attrs.rsPopoverTrigger) {
        id = attrs.rsPopoverTrigger;
      } else if (popoverController) {
        id = popoverController.id;
      } else {
        throw 'No popover ID was specified for popover trigger!';
      }

      element.on('click', function (e) {
        e.preventDefault();

        registry.popover(id).toggle(element);
        scope.$apply();
      });
    }
  };
});

