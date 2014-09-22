describe('rs.popover.Attachment', function () {
  'use strict';

  var target, popover;

  beforeEach(module('rs.popover'));

  beforeEach(function () {
    target = angular.element('<div></div>');
    popover = angular.element('<div><div class="rs-popover"></div></div>');
  });

  describe('top-left', function () {
    it('repositions element', inject(function (Attachment) {
      var position, attachment, popoverElement, top, left;

      position = { top: 0, left: 0 };
      target.offset = jasmine.createSpy('offset').andReturn(position);
      target.outerHeight = jasmine.createSpy('outerHeight').andReturn(50);
      target.outerWidth = jasmine.createSpy('outerWidth').andReturn(50);

      attachment = new Attachment(popover, target, Attachment.TOP_LEFT);
      attachment.position();

      popoverElement = $('.rs-popover', popover).first();
      top = popoverElement.css('top');
      left = popoverElement.css('left');

      expect(top).toBe('61px');
      expect(left).toBe('-8px');
    }));
  });

  describe('left-top', function () {
    it('repositions element', inject(function (Attachment) {
      var position, attachment, popoverElement, top, left;

      position = { top: 0, left: 0 };
      target.offset = jasmine.createSpy('offset').andReturn(position);
      target.outerHeight = jasmine.createSpy('outerHeight').andReturn(50);
      target.outerWidth = jasmine.createSpy('outerWidth').andReturn(50);

      attachment = new Attachment(popover, target, Attachment.LEFT_TOP);
      attachment.position();

      popoverElement = $('.rs-popover', popover).first();
      top = popoverElement.css('top');
      left = popoverElement.css('left');

      expect(top).toBe('-8px');
      expect(left).toBe('61px');
    }));
  });
});
