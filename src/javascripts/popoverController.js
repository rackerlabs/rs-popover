angular.module('rs.popover').controller('PopoverController', function ($scope, $element, $q, PopoverStateMachine, form, registry, tether) {
  'use strict';

  function executeHook(hook, fsm, ctx) {
    var self, result;

    self = this;
    hook = hook || angular.noop;
    result = hook(ctx.data);

    return $q.when(result).then(function () {
      fsm.finish();
    }, function (err) {
      self.errorMessage = err.toString();
      fsm.fail();
    });
  }

  function onOpen(fsm, ctx) {
    form.focus(ctx.element);
    tether.attach(ctx.element, ctx.target, ctx.corner);

    return executeHook.call(this, $scope.onOpen, fsm, ctx);
  }

  function onSave(fsm, ctx) {
    return executeHook.call(this, $scope.onSave, fsm, ctx);
  }

  function onClose(fsm, ctx) {
    if ($scope.form) {
      form.reset($scope.form);
    }

    tether.detach(ctx.element);
  }

  this.id = $scope.id;
  this.fsm = new PopoverStateMachine();
  this.fsm.on('opening', angular.bind(this, onOpen));
  this.fsm.on('saving', angular.bind(this, onSave));
  this.fsm.on('closed', angular.bind(this, onClose));

  registry.register(this.id, this);

  $scope.$on('$destroy', function () {
    registry.deregister($scope.id);
  });

  this.is = function (state) {
    return this.fsm.is(state);
  };

  this.open = function (target, corner, data) {
    this.fsm.setContext({ element: $element, target: target, corner: corner, data: data });
    this.fsm.open();
  };

  this.save = function () {
    if (form.validate($scope.form, $element)) {
      this.fsm.save();
    }
  };

  this.close = function () {
    this.fsm.close();
  };

  this.toggle = function () {
    var handler;

    handler = this.is('closed') ? this.open : this.close;
    handler.apply(this, arguments);
  };

  this.arrow = function () {
    var context, corner;

    context = this.fsm.context;
    corner = context.corner;

    return {
      'rs-popover-arrow': true,
      'rs-popover-arrow-top-left': corner === 'top-left',
      'rs-popover-arrow-left-top': corner === 'left-top'
    };
  };

  this.error = function () {
    return this.errorMessage;
  };
});
