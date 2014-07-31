angular.module('rs.popover').controller('PopoverController', function ($scope, $element, registry, tether, PopoverState) {
  'use strict';

  function resetState() {
    var state;

    state = new PopoverState();
    state.on('open', $scope.onOpen || angular.noop);
    state.on('save', $scope.onSave || angular.noop);
    state.on('close', resetState);

    $scope.state = state;
  }

  this.id = $scope.id;
  registry.register($scope.id, $scope);
  resetState();

  $scope.label = angular.extend({ save: 'Save', cancel: 'Cancel' }, $scope.label);

  $scope.is = function (state) {
    return this.state.is(state);
  };

  $scope.open = function (target) {
    this.state.open();
    tether.attach($element, target);
  };

  $scope.close = function () {
    this.state.close();
  };

  $scope.toggle = function (target) {
    if (this.state.is('closed')) {
      this.open(target);
    } else {
      this.close();
    }
  };

  $scope.save = function () {
    this.state.save();
  };
});

