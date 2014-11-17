angular.module('rs.popover').factory('PopoverStateMachine', function ($q) {
  'use strict';

  var OPENING = 'opening';
  var OPENING_FAILED = 'openingFailed';
  var OPEN = 'open';
  var SAVING = 'saving';
  var SAVING_FAILED = 'savingFailed';
  var CLOSED = 'closed';

  function PopoverStateMachine() {
    this.context = {};
    this.state = CLOSED;

    this.subscriptions = {};
    this.subscriptions[OPENING] = [];
    this.subscriptions[OPENING_FAILED] = [];
    this.subscriptions[OPEN] = [];
    this.subscriptions[SAVING] = [];
    this.subscriptions[SAVING_FAILED] = [];
    this.subscriptions[CLOSED] = [];
  }

  PopoverStateMachine.prototype.setContext = function (context) {
    this.context = context;
  };

  PopoverStateMachine.prototype.is = function (state) {
    return this.state === state;
  };

  PopoverStateMachine.prototype.on = function (e, handler) {
    this.subscriptions[e].push(handler);
  };

  PopoverStateMachine.prototype.transition = function (state) {
    var promises = [];

    this.state = state;
    this.subscriptions[state].forEach(function (handler) {
      promises.push(handler(this, this.context));
    }, this);

    return $q.all(promises);
  };

  PopoverStateMachine.prototype.open = function () {
    if (this.is(CLOSED) || this.is(OPENING_FAILED)) {
      this.transition(OPENING);
    }
  };

  PopoverStateMachine.prototype.save = function () {
    if (this.is(OPEN) || this.is(SAVING_FAILED)) {
      this.transition(SAVING);
    }
  };

  PopoverStateMachine.prototype.finish = function () {
    if (this.is(OPENING)) {
      this.transition(OPEN);
    } else if (this.is(SAVING)) {
      this.transition(CLOSED);
    }
  };

  PopoverStateMachine.prototype.fail = function () {
    if (this.is(OPENING)) {
      this.transition(OPENING_FAILED);
    } else if (this.is(SAVING)) {
      this.transition(SAVING_FAILED);
    }
  };

  PopoverStateMachine.prototype.close = function () {
    if (this.is(SAVING)) {
      return;
    }

    this.transition(CLOSED);
  };

  return PopoverStateMachine;
});
