angular.module('rs.popover').factory('PopoverStateMachine', function ($q) {
  'use strict';

  var LOADING = 'loading';
  var LOADING_FAILED = 'loadingFailed';
  var LOADED = 'loaded';
  var SAVING = 'saving';
  var SAVING_FAILED = 'savingFailed';
  var CLOSED = 'closed';

  function PopoverStateMachine(context) {
    this.state = CLOSED;
    this.context = context;

    this.subscriptions = {};
    this.subscriptions[CLOSED] = [];
    this.subscriptions[LOADING] = [];
    this.subscriptions[LOADING_FAILED] = [];
    this.subscriptions[LOADED] = [];
    this.subscriptions[SAVING] = [];
    this.subscriptions[SAVING_FAILED] = [];
  }

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
      promises.push(handler(this.context));
    }, this);

    return $q.all(promises);
  };

  PopoverStateMachine.prototype.open = function () {
    if (this.is(CLOSED) || this.is(LOADING_FAILED)) {
      this.transition(LOADING);
    }
  };

  PopoverStateMachine.prototype.load = function () {
    if (this.is(LOADING)) {
      this.transition(LOADED);
    }
  };

  PopoverStateMachine.prototype.save = function () {
    if (this.is(LOADED) || this.is(SAVING_FAILED)) {
      this.transition(SAVING);
    }
  };

  PopoverStateMachine.prototype.fail = function () {
    if (this.is(LOADING)) {
      this.transition(LOADING_FAILED);
    } else {
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
