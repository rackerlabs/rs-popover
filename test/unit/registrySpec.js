var Registry = require('../../src/javascripts/registry');

describe('Registry', function () {
  'use strict';

  var registry;

  beforeEach(function () {
    registry = new Registry();
  });

  describe('register', function () {
    it('raises error for empty ID', function () {
      expect(function () {
        registry.register('', {});
      }).toThrow('Popover ID must not be empty!');
    });

    it('raises error for non-unique ID', function () {
      registry.register('unique', {});

      expect(function () {
        registry.register('unique', {});
      }).toThrow('Popover with id "unique" has already been registered!');
    });
  });

  describe('popover', function () {
    it('returns scope for registered popover', function () {
      var scope;

      scope = { my: 'scope' };
      registry.register('mypopoverid', scope);

      expect(registry.popover('mypopoverid')).toBe(scope);
    });

    it('raises error for unregistered popover', function () {
      expect(function () {
        registry.popover('unregistered');
      }).toThrow('Popover with id "unregistered" has not been registered!');
    });
  });
});
