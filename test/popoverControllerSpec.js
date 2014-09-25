describe('rs.popover.PopoverController', function () {
  'use strict';

  var scope, element, form, tether, target;

  beforeEach(module('rs.popover'));

  beforeEach(inject(function ($rootScope, $controller, _form_, _tether_) {
    scope = $rootScope.$new();
    scope.id = 'mypopover';
    scope.attach = 'left-top';
    scope.form = {};
    scope.onOpen = jasmine.createSpy('onOpen');
    scope.onSave = jasmine.createSpy('onSave');

    element = angular.element('<div></div>');
    target = angular.element('<div></div>');

    form = _form_;
    spyOn(form, 'reset');
    spyOn(form, 'validate');

    tether = _tether_;
    spyOn(tether, 'attach');

    $controller('PopoverController', {
      $scope: scope,
      $element: element
    });
  }));

  describe('registration', function () {
    it('registers popover', inject(function (registry) {
      expect(registry.popover('mypopover')).toBe(scope);
    }));

    it('deregisters popover', inject(function (registry) {
      scope.$destroy();

      expect(function () {
        registry.popover('mypopover');
      }).toThrow();
    }));
  });

  describe('open', function () {
    it('transitions popover to loading state', function () {
      scope.open(target);

      expect(scope.is('loading')).toBe(true);
    });

    it('tethers element to target', function () {
      scope.open(target);

      expect(tether.attach).toHaveBeenCalledWith(element, target, 'left-top');
    });

    it('calls onOpen hook', function () {
      scope.open(target);

      expect(scope.onOpen).toHaveBeenCalled();
    });
  });

  describe('close', function () {
    it('transitions popover to closed state', function () {
      scope.open(target);
      scope.close();

      expect(scope.is('closed')).toBe(true);
    });

    it('resets form', function () {
      scope.open(target);
      scope.close();

      expect(form.reset).toHaveBeenCalledWith(element, scope.form);
    });
  });

  describe('toggle', function () {
    it('opens popover when it is closed', function () {
      scope.close();

      scope.toggle(target);

      expect(scope.is('loading')).toBe(true);
    });

    it('closes popover when it is not closed', function () {
      scope.open();

      scope.toggle(target);

      expect(scope.is('closed')).toBe(true);
    });
  });

  describe('save', function () {
    it('forces validation', function () {
      scope.save();

      expect(form.validate).toHaveBeenCalledWith(element, scope.form);
    });

    describe('when form is valid', function () {
      beforeEach(function () {
        scope.form.$valid = true;
      });

      it('transitions popover to saving state when ', function () {
        scope.save();

        expect(scope.is('saving')).toBe(true);
      });

      it('calls onSave hook', function () {
        scope.save(target);

        expect(scope.onSave).toHaveBeenCalled();
      });
    });

    describe('when form is invalid', function () {
      beforeEach(function () {
        scope.form.$valid = false;
      });

      it('transitions popover to saving state when ', function () {
        scope.save();

        expect(scope.is('saving')).toBe(false);
      });

      it('calls onSave hook', function () {
        scope.save(target);

        expect(scope.onSave).not.toHaveBeenCalled();
      });
    });
  });
});
