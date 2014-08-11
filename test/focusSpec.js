describe('rs.popover.focus', function () {
  'use strict';

  var timeout, focus, element;

  beforeEach(module('rs.popover'));

  beforeEach(inject(function ($timeout, _focus_) {
    timeout = $timeout;
    focus = _focus_;

    element = angular.element('<div><input id="input"></div>');
    element.appendTo(document.body);
  }));

  it('focuses input inside element', function () {
    focus(element);
    timeout.flush();

    expect(document.activeElement).toBe(document.getElementById('input'));
  });
});
