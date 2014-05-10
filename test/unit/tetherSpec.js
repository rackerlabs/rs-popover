var Tether = require('../../src/javascripts/tether');

describe('tether', function () {
  'use strict';

  var tether, target, popover;

  beforeEach(function () {
    tether = new Tether();
    target = angular.element('<div></div>');
    popover = angular.element('<div><div class="rs-popover"></div></div>');
  });

  describe('attach', function () {
    it('repositions popover', function () {
      var position;

      position = { top: 0, left: 0 };
      target.offset = jasmine.createSpy('offset').andReturn(position);
      target.outerHeight = jasmine.createSpy('outerHeight').andReturn(50);
      target.outerWidth = jasmine.createSpy('outerWidth').andReturn(50);

      tether.attach(target, popover);

      expect(position).toEqual({ top: 61, left: -8 });
    });
  });
});
