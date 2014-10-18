angular.module('rs.popover').factory('PopoverState', function ($q) {
  'use strict';

  function PopoverState() {
    this.state = PopoverState.CLOSED;
    this.subscriptions = { open: [], load: [], error: [], save: [], fail: [], close: [] };
  }

  PopoverState.prototype.is = function (state) {
    return this.state === state;
  };

  PopoverState.prototype.on = function (e, handler) {
    this.subscriptions[e].push(handler);
  };

  PopoverState.prototype.fire = function (e) {
    var promises = [];

    angular.forEach(this.subscriptions[e], function (handler) {
      promises.push(handler());
    });

    return $q.all(promises);
  };

  PopoverState.prototype.open = function () {
    this.message = 'Loading…';
    this.state = PopoverState.LOADING;
    this.fire('open')
      .then(angular.bind(this, this.load))
      .catch(angular.bind(this, this.error));
  };

  PopoverState.prototype.load = function () {
    this.state = PopoverState.OPEN;
    this.fire('load');
  };

  // TODO: This should accept an error instead of a message.
  PopoverState.prototype.error = function (message) {
    this.message = message;
    this.state = PopoverState.ERROR;
    this.fire('error');
  };

  PopoverState.prototype.save = function () {
    this.state = PopoverState.SAVING;
    this.fire('save')
      .then(angular.bind(this, this.close))
      .catch(angular.bind(this, this.fail));
  };

  PopoverState.prototype.fail = function (error) {
    this.message = error.toString();
    this.state = PopoverState.FAILED;
    this.fire('fail');
  };

  PopoverState.prototype.close = function () {
    this.state = PopoverState.CLOSED;
    this.fire('close');
  };

  PopoverState.CLOSED = 'closed';
  PopoverState.LOADING = 'loading';
  PopoverState.OPEN = 'open';
  PopoverState.ERROR = 'error';
  PopoverState.SAVING = 'saving';
  PopoverState.FAILED = 'failed';

  return PopoverState;
});
