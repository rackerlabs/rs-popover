function Registry() {
  'use strict';

  this.popovers = [];
}

Registry.prototype.register = function (id, scope) {
  'use strict';

  if (!id) {
    throw 'Popover ID must not be empty!';
  } else if (this.popovers.hasOwnProperty(id)) {
    throw 'Popover with id "' + id + '" has already been registered!';
  }

  this.popovers[id] = scope;
};

Registry.prototype.popover = function (id) {
  'use strict';

  if (!this.popovers.hasOwnProperty(id)) {
    throw 'Popover with id "' + id + '" has not been registered!';
  }

  return this.popovers[id];
};

module.exports = Registry;
