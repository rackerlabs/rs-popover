angular.module('rs.popover').directive('rsPopoverTrigger', function (registry) {
  'use strict';

  function findPopoverId(attrs, popoverController) {
    if (attrs.rsPopoverTrigger) {
      return attrs.rsPopoverTrigger;
    } else if (popoverController) {
      return popoverController.id;
    }

    throw 'No popover ID was specified for popover trigger!';
  }

  function findPopoverTarget(element, attrs) {
    if (attrs.rsPopoverTarget) {
      return angular.element('#' + attrs.rsPopoverTarget);
    }

    return element;
  }

  return {
    restrict: 'A',
    require: '?^rsPopover',
    link: function (scope, element, attrs, popoverController) {
      var id, target;

      id = findPopoverId(attrs, popoverController);
      target = findPopoverTarget(element, attrs);

      element.on('click', function (e) {
        e.preventDefault();

        registry.popover(id).toggle(target, 'top-left');
        scope.$apply();
      });
    }
  };
});

