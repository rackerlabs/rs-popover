describe('rs.popover.PopoverState', function () {
  'use strict';

  var q, scope, PopoverState, fsm, callback, deferred;

  beforeEach(module('rs.popover'));

  beforeEach(inject(function (_PopoverState_, $q, $rootScope) {
    q = $q;
    scope = $rootScope;
    PopoverState = _PopoverState_;

    fsm = new PopoverState();

    deferred = $q.defer();
    callback = jasmine.createSpy('callback').andReturn(deferred.promise);
  }));

  it('is initially closed', function () {
    expect(fsm.is('closed')).toBe(true);
  });

  describe('open', function () {
    beforeEach(function () {
      spyOn(fsm, 'load');
      spyOn(fsm, 'error');

      fsm.on('open', callback);
      fsm.open();
    });

    it('transitions state to loading', function () {
      expect(fsm.is('loading')).toBe(true);
    });

    it('sets message to loading', function () {
      expect(fsm.message).toBe('Loading…');
    });

    it('executes open callback', function () {
      expect(callback).toHaveBeenCalled();
    });

    it('calls load when open callback resolves', function () {
      deferred.resolve();
      scope.$digest();

      expect(fsm.load).toHaveBeenCalled();
    });

    it('calls error when open callback fails', function () {
      deferred.reject('fail');
      scope.$digest();

      expect(fsm.error).toHaveBeenCalledWith('fail');
    });
  });

  describe('load', function () {
    beforeEach(function () {
      fsm.on('load', callback);
      fsm.load();
    });

    it('transitions state to open', function () {
      expect(fsm.is('open')).toBe(true);
    });

    it('executes load callback', function () {
      expect(callback).toHaveBeenCalled();
    });
  });

  describe('error', function () {
    beforeEach(function () {
      fsm.on('error', callback);
      fsm.error('everything is broken');
    });

    it('transitions state to error', function () {
      expect(fsm.is('error')).toBe(true);
    });

    it('sets message to provided argument', function () {
      expect(fsm.message).toBe('everything is broken');
    });

    it('executes error callback', function () {
      expect(callback).toHaveBeenCalled();
    });
  });

  describe('save', function () {
    beforeEach(function () {
      spyOn(fsm, 'fail');
      spyOn(fsm, 'close');

      fsm.on('save', callback);
      fsm.save();
    });

    it('transitions state to saving', function () {
      expect(fsm.is('saving')).toBe(true);
    });

    it('executes save callback', function () {
      fsm.save();

      expect(callback).toHaveBeenCalled();
    });

    it('calls close when save callback resolves', function () {
      deferred.resolve();
      scope.$digest();

      expect(fsm.close).toHaveBeenCalled();
    });

    it('calls fail when save callback fails', function () {
      deferred.reject('fail');
      scope.$digest();

      expect(fsm.fail).toHaveBeenCalled();
    });
  });

  describe('fail', function () {
    beforeEach(function () {
      fsm.on('fail', callback);
      fsm.fail(new Error('everything is broken'));
    });

    it('transitions state to error', function () {
      expect(fsm.is('failed')).toBe(true);
    });

    it('sets message to provided argument', function () {
      expect(fsm.message).toBe('Error: everything is broken');
    });

    it('executes fail callback', function () {
      expect(callback).toHaveBeenCalled();
    });
  });

  describe('close', function () {
    beforeEach(function () {
      fsm.on('close', callback);

      fsm.open();
      fsm.close();
    });

    it('transitions state to error', function () {
      expect(fsm.is('closed')).toBe(true);
    });

    it('executes close callback', function () {
      expect(callback).toHaveBeenCalled();
    });
  });
});
