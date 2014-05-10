/* global window */

var angular = window.angular;

angular.module('rsPopover', [])
  .service('tether', require('./tether'))
  .service('registry', require('./registry'))
  .controller('PopoverController', ['$scope', require('./popoverController')])
  .directive('rsPopover', ['registry', 'tether', require('./popoverDirective')])
  .directive('rsPopoverTrigger', ['registry', require('./popoverTriggerDirective')]);
