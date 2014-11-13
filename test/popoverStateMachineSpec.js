describe('rs.popover.PopoverStateMachine', function () {
  'use strict';

  var fsm, ctx;

  beforeEach(module('rs.popover'));

  beforeEach(inject(function (PopoverStateMachine) {
    ctx = {};
    fsm = new PopoverStateMachine(ctx);
  }));

  it('starts in "closed" state', function () {
    expect(fsm.is('closed')).toBeTruthy();
  });

  describe('transition', function () {
    it('passes context to event handler', function () {
      var handler;

      handler = jasmine.createSpy('handler');
      fsm.on('closed', handler);

      fsm.transition('closed');

      expect(handler).toHaveBeenCalledWith(ctx);
    });
  });

  describe('open', function () {
    it('transitions from closed to loading', function () {
      fsm.transition('closed');
      fsm.open();

      expect(fsm.is('loading')).toBeTruthy();
    });

    it('transitions from loadingFailed to loading', function () {
      fsm.transition('loadingFailed');
      fsm.open();

      expect(fsm.is('loading')).toBeTruthy();
    });

    it('will not transition from loaded to loading', function () {
      fsm.transition('loaded');
      fsm.open();

      expect(fsm.is('loading')).toBeFalsy();
    });

    it('will not transition from saving to loading', function () {
      fsm.transition('saving');
      fsm.open();

      expect(fsm.is('loading')).toBeFalsy();
    });

    it('will not transition from savingFailed to loading', function () {
      fsm.transition('savingFailed');
      fsm.open();

      expect(fsm.is('loading')).toBeFalsy();
    });
  });

  describe('load', function () {
    it('transitions from loading to loaded', function () {
      fsm.transition('loading');
      fsm.load();

      expect(fsm.is('loaded')).toBeTruthy();
    });

    it('will not transition from closed to loaded', function () {
      fsm.transition('closed');
      fsm.load();

      expect(fsm.is('loaded')).toBeFalsy();
    });

    it('will not transition from loadingFailed to loaded', function () {
      fsm.transition('loadingFailed');
      fsm.load();

      expect(fsm.is('loaded')).toBeFalsy();
    });

    it('will not transition from saving to loaded', function () {
      fsm.transition('saving');
      fsm.load();

      expect(fsm.is('loaded')).toBeFalsy();
    });

    it('will not transition from savingFailed to loaded', function () {
      fsm.transition('savingFailed');
      fsm.load();

      expect(fsm.is('loaded')).toBeFalsy();
    });
  });

  describe('save', function () {
    it('transitions from loaded to saving', function () {
      fsm.transition('loaded');
      fsm.save();

      expect(fsm.is('saving')).toBeTruthy();
    });

    it('transitions from savingFailed to saving', function () {
      fsm.transition('savingFailed');
      fsm.save();

      expect(fsm.is('saving')).toBeTruthy();
    });

    it('will not transition from closed to saving', function () {
      fsm.transition('closed');
      fsm.save();

      expect(fsm.is('saving')).toBeFalsy();
    });

    it('will not transition from loading to saving', function () {
      fsm.transition('loading');
      fsm.save();

      expect(fsm.is('saving')).toBeFalsy();
    });

    it('will not transition from loadingFailed to saving', function () {
      fsm.transition('loadingFailed');
      fsm.save();

      expect(fsm.is('saving')).toBeFalsy();
    });
  });

  describe('fail', function () {
    it('transitions from loading to loadingFailed', function () {
      fsm.transition('loading');
      fsm.fail();

      expect(fsm.is('loadingFailed')).toBeTruthy();
    });

    it('transitions from saving to savingFailed', function () {
      fsm.transition('saving');
      fsm.fail();

      expect(fsm.is('savingFailed')).toBeTruthy();
    });

    it('will not transition from closed to saving', function () {
      fsm.transition('closed');
      fsm.save();

      expect(fsm.is('saving')).toBeFalsy();
    });

    it('will not transition from loading to saving', function () {
      fsm.transition('loading');
      fsm.save();

      expect(fsm.is('saving')).toBeFalsy();
    });

    it('will not transition from loadingFailed to saving', function () {
      fsm.transition('loadingFailed');
      fsm.save();

      expect(fsm.is('saving')).toBeFalsy();
    });
  });

  describe('close', function () {
    it('transitions from loading to closed', function () {
      fsm.transition('loading');
      fsm.close();

      expect(fsm.is('closed')).toBeTruthy();
    });

    it('transitions from loaded to closed', function () {
      fsm.transition('loaded');
      fsm.close();

      expect(fsm.is('closed')).toBeTruthy();
    });

    it('transitions from loadingFailed to closed', function () {
      fsm.transition('loadingFailed');
      fsm.close();

      expect(fsm.is('closed')).toBeTruthy();
    });

    it('transitions from savingFailed to closed', function () {
      fsm.transition('savingFailed');
      fsm.close();

      expect(fsm.is('closed')).toBeTruthy();
    });

    it('will not transition from saving to closed', function () {
      fsm.transition('saving');
      fsm.close();

      expect(fsm.is('closed')).toBeFalsy();
    });
  });
});
