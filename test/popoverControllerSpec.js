describe('rs.popover.PopoverController', function () {
  'use strict';

  var scope, element, tether, target;

  beforeEach(module('rs.popover'));

  beforeEach(inject(function ($rootScope, $controller, _tether_) {
    scope = $rootScope.$new();
    scope.id = 'mypopover';
    scope.onOpen = jasmine.createSpy('onOpen');
    scope.onSave = jasmine.createSpy('onSave');

    element = angular.element('<div></div>');
    target = angular.element('<div></div>');

    tether = _tether_;
    spyOn(tether, 'attach');

    $controller('PopoverController', {
      $scope: scope,
      $element: element
    });
  }));

  describe('registration', function () {
    var registry;
    
    beforeEach(inject(function ($controller, _registry_) {
      registry = _registry_;
      spyOn(registry, 'register');
      spyOn(registry, 'deregister');

      $controller('PopoverController', {
        $scope: scope,
        $element: element
      });
    }));

    it('registers popover', function () {
      expect(registry.register).toHaveBeenCalledWith('mypopover', scope);
    });

    it('deregisters popover', function () {
      scope.$destroy();

      expect(registry.deregister).toHaveBeenCalledWith('mypopover');
    });
  });

  describe('open', function () {
    it('transitions popover to loading state', function () {
      scope.open(target);

      expect(scope.is('loading')).toBe(true);
    });

    it('tethers element to target', function () {
      scope.open(target);

      expect(tether.attach).toHaveBeenCalledWith(element, target);
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
  });

  describe('toggle', function () {
    beforeEach(function () {
      spyOn(scope, 'open');
      spyOn(scope, 'close');

      scope.state = {};
      scope.state.is = jasmine.createSpy('is');
    });

    it('opens popover when it is closed', function () {
      scope.state.is.andCallFake(function (state) {
        return state === 'closed';
      });

      scope.toggle(target);

      expect(scope.open).toHaveBeenCalledWith(target);
    });

    it('closes popover when it is not closed', function () {
      scope.state.is.andCallFake(function (state) {
        return state !== 'closed';
      });

      scope.toggle(target);

      expect(scope.close).toHaveBeenCalledWith();
    });
  });

  describe('save', function () {
    describe('when form is valid', function () {
      beforeEach(function () {
        scope.form = { $valid: true };
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
        scope.form = { $valid: false };
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
