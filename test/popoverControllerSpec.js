describe('rs.popover.PopoverController', function () {
  'use strict';

  var scope, element, target, data, controller;

  beforeEach(module('rs.popover'));

  beforeEach(inject(function ($rootScope, $controller, form, tether) {
    spyOn(form, 'reset');
    spyOn(tether, 'attach');
    spyOn(tether, 'detach');

    data = {};
    element = angular.element();
    target = angular.element();
    scope = $rootScope.$new();
    scope.id = 'mypopover';

    controller = $controller('PopoverController', {
      $scope: scope,
      $element: element
    });
  }));

  describe('register', function () {
    it('registers popover on creation', inject(function (registry) {
      expect(registry.popover('mypopover')).toBe(controller);
    }));

    it('deregisters popover on destroy', inject(function (registry) {
      scope.$destroy();

      expect(function () {
        registry.popover('mypopover');
      }).toThrow('Popover ID "mypopover" has not been registered!');
    }));
  });

  describe('toggle', function () {
    it('calls open with arguments when closed', function () {
      controller.close();
      spyOn(controller, 'open');

      controller.toggle('one', 'two', 'three');

      expect(controller.open).toHaveBeenCalledWith('one', 'two', 'three');
    });

    it('calls close with arguments when not closed', function () {
      controller.open();
      spyOn(controller, 'close');

      controller.toggle('one', 'two', 'three');

      expect(controller.close).toHaveBeenCalledWith('one', 'two', 'three');
    });
  });

  describe('open', function () {
    it('attaches element to target', inject(function (tether) {
      controller.open(target, 'corner', data);

      expect(tether.attach).toHaveBeenCalledWith(element, target, 'corner');
    }));

    it('focuses first input when callback succeeds', inject(function ($q, form) {
      var deferred;

      spyOn(form, 'focus');
      deferred = $q.defer();
      scope.onOpen = jasmine.createSpy('onOpen').andReturn(deferred.promise);

      controller.open(target, 'corner', data);

      deferred.resolve();
      scope.$digest();

      expect(form.focus).toHaveBeenCalledWith(element);
    }));

    it('transitions to loaded when callback succeeds', inject(function ($q) {
      var deferred;

      deferred = $q.defer();
      scope.onOpen = jasmine.createSpy('onOpen').andReturn(deferred.promise);

      controller.open(target, 'corner', data);

      deferred.resolve();
      scope.$digest();

      expect(controller.is('open')).toBeTruthy();
    }));

    it('transitions to loadingFailed when callback fails', inject(function ($q) {
      var deferred;

      deferred = $q.defer();
      scope.onOpen = jasmine.createSpy('onOpen').andReturn(deferred.promise);

      controller.open(target, 'corner', data);

      deferred.reject(new Error('everything is broken'));
      scope.$digest();

      expect(controller.is('openingFailed')).toBeTruthy();
    }));
  });

  describe('save', function () {
    beforeEach(inject(function (form) {
      spyOn(form, 'validate').andReturn(true);

      controller.open(target, 'corner', data);
      scope.form = {};
      scope.$digest();
    }));

    it('transitions to saving when validation passes', inject(function (form) {
      form.validate.andReturn(true);
      controller.save();

      expect(controller.is('saving')).toBeTruthy();
    }));

    it('does not transit to saving when validation fails', inject(function (form) {
      form.validate.andReturn(false);
      controller.save();

      expect(controller.is('open')).toBeTruthy();
    }));

    it('transitions to closed when callback succeeds', inject(function ($q) {
      var deferred;

      deferred = $q.defer();
      scope.onSave = jasmine.createSpy('onSave').andReturn(deferred.promise);

      controller.save();

      deferred.resolve();
      scope.$digest();

      expect(controller.is('closed')).toBeTruthy();
    }));

    it('transitions to savingFailed when callback fails', inject(function ($q) {
      var deferred;

      deferred = $q.defer();
      scope.onSave = jasmine.createSpy('onSave').andReturn(deferred.promise);

      controller.save();

      deferred.reject(new Error('everything is broken'));
      scope.$digest();

      expect(controller.is('savingFailed')).toBeTruthy();
    }));
  });

  describe('close', function () {
    beforeEach(function () {
      controller.open();
      scope.form = {};
    });

    it('resets form validation', inject(function (form) {
      controller.close();

      expect(form.reset).toHaveBeenCalledWith(scope.form);
    }));

    it('detaches element from target', inject(function (tether) {
      controller.close();

      expect(tether.detach).toHaveBeenCalledWith(element);
    }));

    it('transitions to closed', function () {
      controller.close();

      expect(controller.is('closed')).toBeTruthy();
    });
  });
});
