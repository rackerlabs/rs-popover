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
      return angular.element('#' + attrs.rsPopoverTarget);
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
      var id, corner, data;

      id = findPopoverId(attrs, popoverController);
      corner = findPopoverCorner(attrs);
      data = evalPopoverData(scope, attrs);

      element.on('click', function (e) {
        e.preventDefault();

        var target = findPopoverTarget(element, attrs);

        registry.popover(id).toggle(target, corner, data);
        scope.$apply();
      });
    }
  };
});

