angular.module('rs.popover').factory('form', function () {
  'use strict';

  function reset(element, form) {
    if (form) {
      form.$setPristine();
    }
  }

  function validate(element) {
    element = angular.element(element);
    element.find(':input').each(function (i, element) {
      var controller;

      element = angular.element(element);
      controller = element.controller('ngModel');

      if (!controller) {
        return;
      }

      /*
      HACK: We need a way to force validation on fields that haven't been
      interacted with, so we change the view value from `undefined` to an empty
      string using $setViewValue. However, this only works the first time
      validation is forced, so we need to alternate between setting `undefined`
      and an empty string.
      */
      if (controller.$viewValue === undefined) {
        controller.$setViewValue('');
      } else if (controller.$viewValue === '') {
        controller.$setViewValue(undefined);
      }

      controller.$commitViewValue();
    });
  }

  return {
    reset: reset,
    validate: validate
  };
});
