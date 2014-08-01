describe('rs.popover.Registry', function () {
  'use strict';

  var registry;

  beforeEach(module('rs.popover'));

  beforeEach(inject(function (_registry_) {
    registry = _registry_;
  }));

  describe('register', function () {
    it('raises exception for empty ID', function () {
      expect(function () {
        registry.register('', {});
      }).toThrow('Popover ID must not be empty!');
    });

    it('raises exception for non-unique ID', function () {
      registry.register('unique', {});

      expect(function () {
        registry.register('unique');
      }).toThrow('Popover ID "unique" has already been registered!');
    });
  });

  describe('deregister', function () {
    it('raises exception for unregistered popover', function () {
      expect(function () {
        registry.deregister('unregistered');
      }).toThrow('Popover ID "unregistered" has not been registered!');
    });

    it('removes registered popover from registry', function () {
      registry.register('mypopover', {});
      registry.deregister('mypopover');

      expect(function () {
        registry.popover('mypopover');
      }).toThrow('Popover ID "mypopover" has not been registered!');
    });
  });

  describe('popover', function () {
    it('returns registered popover', function () {
      var controller;

      controller = {};
      registry.register('mypopover', controller);

      expect(registry.popover('mypopover')).toBe(controller);
    });

    it('raises exception for unregistered popover', function () {
      expect(function () {
        registry.popover('unregistered');
      }).toThrow('Popover ID "unregistered" has not been registered!');
    });
  });
});
