angular.module('rs.popover').controller('PopoverController', function ($scope, $element, registry, tether, focus, PopoverState) {
  'use strict';

  function forEachBoundInput(callback) {
    $element.find(':input').each(function (i, element) {
      var modelController;

      element = $(element);
      modelController = element.controller('ngModel');

      if (modelController) {
        callback.call(this, element, modelController);
      }
    });
  }

  function resetValidation() {
    forEachBoundInput(function (element, controller) {
      controller.$setUntouched();
    });
  }

  function forceValidation() {
    forEachBoundInput(function (element, controller) {
      controller.$setTouched();
    });
  }

  function resetState() {
    var state;

    state = new PopoverState();
    state.on('open', $scope.onOpen || angular.noop);
    state.on('save', $scope.onSave || angular.noop);
    state.on('close', resetState);
    state.on('load', function () {
      focus($element);
    });

    resetValidation();

    $scope.state = state;
  }

  this.id = $scope.id;
  registry.register($scope.id, $scope);
  resetState();

  $scope.styles = {
    'rs-popover-arrow': true,
    'rs-popover-arrow-top-left': $scope.attach === 'top-left',
    'rs-popover-arrow-left-top': $scope.attach === 'left-top'
  };

  $scope.$on('$destroy', function () {
    registry.deregister($scope.id);
  });

  $scope.is = function (state) {
    return $scope.state.is(state);
  };

  $scope.open = function (target) {
    $scope.state.open();
    tether.attach($element, target, $scope.attach);
  };

  $scope.close = function () {
    $scope.state.close();
  };

  $scope.toggle = function (target) {
    if ($scope.state.is('closed')) {
      $scope.open(target);
    } else {
      $scope.close();
    }
  };

  $scope.save = function () {
    forceValidation();

    if ($scope.form.$valid) {
      $scope.state.save();
    }
  };
});

