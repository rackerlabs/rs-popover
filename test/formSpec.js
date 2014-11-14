describe('rs.popover.form', function () {
  'use strict';

  var scope, element, controller, form;

  beforeEach(module('rs.popover'));

  beforeEach(inject(function ($rootScope, $compile, _form_) {
    scope = $rootScope.$new();
    scope.one = '';
    scope.two = undefined;

    element = $compile('<form><input ng-model="one" required><input ng-model="two" required></form>')(scope);
    controller = element.controller('form');

    scope.$digest();

    form = _form_;
  }));

  describe('reset', function () {
    it('marks form as pristine', function () {
      controller.$setDirty();

      form.reset(controller);

      expect(controller.$pristine).toBe(true);
    });
  });

  describe('focus', function () {
    var timeout;

    beforeEach(inject(function ($timeout) {
      timeout = $timeout;

      element = angular.element('<div><input id="input"></div>');
      element.appendTo(document.body);
    }));

    it('focuses input inside element', function () {
      form.focus(element);
      timeout.flush();

      expect(document.activeElement).toBe(document.getElementById('input'));
    });
  });

  describe('validate', function () {
    it('marks form as dirty', function () {
      controller.$setPristine();

      form.validate(controller, element);

      expect(controller.$dirty).toBe(true);
    });

    it('marks each input as dirty', function () {
      var inputs;

      controller.$setPristine();

      form.validate(controller, element);

      inputs = element.find(':input');
      inputs.each(function (i, element) {
        var controller;

        controller = $(element).controller('ngModel');
        expect(controller.$dirty).toBe(true);
      });
      expect(inputs.length).toBe(2);
    });
  });
});
