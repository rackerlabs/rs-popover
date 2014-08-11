angular.module('rs.popover').factory('focus', function ($timeout) {
  'use strict';

  return function focus(element, invokeApply) {
    return $timeout(function () {
      var focusableElement;

      focusableElement = element.find(':input').first();
      focusableElement.focus();
    }, 0, invokeApply || false);
  };
});
