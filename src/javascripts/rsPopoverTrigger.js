angular.module('rs.popover').directive('rsPopoverTrigger', function (registry, Attachment) {
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
      var target = document.getElementById(attrs.rsPopoverTarget);
      return angular.element(target);
    }

    return element;
  }

  function findPopoverCorner(attrs) {
    if (attrs.rsPopoverAttach) {
      return attrs.rsPopoverAttach;
    }

    return Attachment.TOP_LEFT;
  }

  function evalPopoverData(scope, attrs) {
    if (attrs.rsPopoverData) {
      return scope.$eval(attrs.rsPopoverData);
    }

    return {};
  }

  return {
    restrict: 'A',
    require: '?^rsPopover',
    link: function (scope, element, attrs, popoverController) {
      var id, target, corner, data;

      id = findPopoverId(attrs, popoverController);
      target = findPopoverTarget(element, attrs);
      corner = findPopoverCorner(attrs);
      data = evalPopoverData(scope, attrs);

      element.on('click', function (e) {
        e.preventDefault();

        registry.popover(id).toggle(target, corner, data);
        scope.$apply();
      });
    }
  };
});
