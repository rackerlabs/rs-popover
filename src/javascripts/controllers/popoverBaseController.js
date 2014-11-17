angular.module('rs.popover').controller('PopoverBaseController', function ($scope, $element, $q, PopoverStateMachine, form, registry, tether) {
  'use strict';

  function executeHook(hook, fsm, ctx) {
    var result;

    hook = hook || angular.noop;
    result = hook(ctx.data);

    return $q.when(result).then(function () {
      fsm.finish();
    }, function () {
      fsm.fail();
    });
  }

  function onOpen(fsm, ctx) {
    form.focus(ctx.element);
    tether.attach(ctx.element, ctx.target, ctx.corner);

    return executeHook($scope.onOpen, fsm, ctx);
  }

  function onSave(fsm, ctx) {
    return executeHook($scope.onSave, fsm, ctx);
  }

  function onClose(fsm, ctx) {
    if ($scope.form) {
      form.reset($scope.form);
    }

    tether.detach(ctx.element);
  }

  this.id = $scope.id;
  this.fsm = new PopoverStateMachine();
  this.fsm.on('opening', onOpen);
  this.fsm.on('saving', onSave);
  this.fsm.on('closed', onClose);

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
});
