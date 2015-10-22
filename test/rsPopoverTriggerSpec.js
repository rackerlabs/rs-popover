describe('rs.popover.rsPopoverTrigger', function () {
  'use strict';

  var scope, popover, registry;

  beforeEach(module('rs.popover'));

  beforeEach(inject(function ($rootScope, _registry_) {
    scope = $rootScope.$new();
    popover = { toggle: jasmine.createSpy('toggle') };
    registry = _registry_;

    spyOn(registry, 'popover').andReturn(popover);
  }));

  describe('rs-popover-trigger', function () {
    it('toggles popover specified by attribute', inject(function ($compile) {
      var element;

      element = $compile('<a rs-popover-trigger="mypopover"></a>')(scope);
      scope.$digest();

      element.triggerHandler('click');

      expect(registry.popover).toHaveBeenCalledWith('mypopover');
    }));

    it('toggles popover that contains trigger', inject(function ($compile) {
      var element;

      element = $compile('<rs-popover id="popover"><a rs-popover-trigger>Trigger</a></rs-popover>')(scope);
      scope.$digest();

      element.find('a').triggerHandler('click');

      expect(registry.popover).toHaveBeenCalledWith('popover');
    }));
  });

  describe('rs-popover-target', function () {
    it('points popover at specified element, locating it at click-event-time', inject(function ($compile) {
      var element, target;

      element = $compile('<a rs-popover-trigger="mypopover" rs-popover-target="target"></a>')(scope);
      angular.element('body').append('<div id="target"></div>');
      scope.$digest();

      element.triggerHandler('click');

      target = popover.toggle.argsForCall[0][0];
      expect(target).toEqual(angular.element('#target'));

      $('#target').remove();
    }));

    it('points popover at trigger', inject(function ($compile) {
      var element, target;

      element = $compile('<a rs-popover-trigger="mypopover"></a>')(scope);
      scope.$digest();

      element.triggerHandler('click');

      target = popover.toggle.argsForCall[0][0].get();
      expect(target).toEqual(element.get());
    }));
  });

  describe('rs-popover-attach', function () {
    it('attaches popover at specified attachment point', inject(function ($compile) {
      var element, corner;

      element = $compile('<a rs-popover-trigger="mypopover" rs-popover-attach="left-top"></a>')(scope);
      scope.$digest();

      element.triggerHandler('click');

      corner = popover.toggle.argsForCall[0][1];
      expect(corner).toEqual('left-top');
    }));

    it('attaches popover at default attachment point', inject(function ($compile) {
      var element, corner;

      element = $compile('<a rs-popover-trigger="mypopover"></a>')(scope);
      scope.$digest();

      element.triggerHandler('click');

      corner = popover.toggle.argsForCall[0][1];
      expect(corner).toEqual('top-left');
    }));
  });

  describe('rs-popover-data', function () {
    it('passes specified data to popover', inject(function ($compile) {
      var element, data;

      scope.model = { id: 'my-id', name: 'my-name' };
      element = $compile('<a rs-popover-trigger="mypopover" rs-popover-data="{ model: model, other: \'data\' }"></a>')(scope);
      scope.$digest();

      element.triggerHandler('click');

      data = popover.toggle.argsForCall[0][2];
      expect(data).toEqual({
        model: scope.model,
        other: 'data'
      });
    }));

    it('passes default data to popover', inject(function ($compile) {
      var element, data;

      scope.model = { id: 'my-id', name: 'my-name' };
      element = $compile('<a rs-popover-trigger="mypopover"></a>')(scope);
      scope.$digest();

      element.triggerHandler('click');

      data = popover.toggle.argsForCall[0][2];
      expect(data).toEqual({});
    }));
  });
});
