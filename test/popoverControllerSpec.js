describe('rs.popover.PopoverController', function () {
  'use strict';

  var scope, element, registry, tether, target;

  beforeEach(module('rs.popover'));

  beforeEach(inject(function ($rootScope, $controller, _registry_, _tether_) {
    scope = $rootScope.$new();
    scope.id = 'mypopover';
    scope.onOpen = jasmine.createSpy('onOpen');
    scope.onSave = jasmine.createSpy('onSave');

    element = angular.element('<div></div>');

    registry = _registry_;
    spyOn(registry, 'register');

    tether = _tether_;
    spyOn(tether, 'attach');

    target = angular.element();
    controller = $controller('PopoverController', {
      $scope: scope,
      $element: element
    });
  }));

  it('registers popover', function () {
    expect(registry.register).toHaveBeenCalledWith('mypopover', scope);
  });

  it('registers open hook with state', function () {
    expect(scope.state.subscriptions.open).toContain(scope.onOpen);
  });

  it('registers save hook with state', function () {
    expect(scope.state.subscriptions.save).toContain(scope.onSave);
  });

  describe('labels', function () {
    it('uses provided save label', inject(function ($controller) {
      scope.label = { save: 'shoot' };

      $controller('PopoverController', {
        $scope: scope,
        $element: element
      });

      expect(scope.label.save).toBe('shoot');
    }));

    it('uses default save label', inject(function ($controller) {
      scope.label = { };

      $controller('PopoverController', {
        $scope: scope,
        $element: element
      });

      expect(scope.label.save).toBe('Save');
    }));

    it('uses provided cancel label', inject(function ($controller) {
      scope.label = { cancel: 'score' };

      $controller('PopoverController', {
        $scope: scope,
        $element: element
      });

      expect(scope.label.cancel).toBe('score');
    }));

    it('uses default cancel label', inject(function ($controller) {
      scope.label = { };

      $controller('PopoverController', {
        $scope: scope,
        $element: element
      });

      expect(scope.label.cancel).toBe('Cancel');
    }));
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
    it('transitions popover to saving state', function () {
      scope.save();

      expect(scope.is('saving')).toBe(true);
    });
  });
});
