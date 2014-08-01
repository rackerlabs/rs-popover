angular.module('rs.popover').factory('registry', function () {
  'use strict';

  function Registry() {
    this.popovers = {};
  }

  Registry.prototype.register = function (id, scope) {
    if (!id) {
      throw 'Popover ID must not be empty!';
    } else if (id in this.popovers) {
      throw 'Popover ID "' + id + '" has already been registered!';
    }

    this.popovers[id] = scope;
  };

  Registry.prototype.deregister = function (id) {
    if (id in this.popovers) {
      delete this.popovers[id];
    } else {
      throw 'Popover ID "' + id + '" has not been registered!';
    }
  };

  Registry.prototype.popover = function (id) {
    if (id in this.popovers) {
      return this.popovers[id];
    }

    throw 'Popover ID "' + id + '" has not been registered!';
  };

  return new Registry();
});
