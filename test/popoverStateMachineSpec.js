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

      expect(handler).toHaveBeenCalledWith(fsm, ctx);
    });
  });

  describe('open', function () {
    it('transitions from closed to opening', function () {
      fsm.transition('closed');
      fsm.open();

      expect(fsm.is('opening')).toBeTruthy();
    });

    it('transitions from openingFailed to opening', function () {
      fsm.transition('openingFailed');
      fsm.open();

      expect(fsm.is('opening')).toBeTruthy();
    });

    it('will not transition from open to opening', function () {
      fsm.transition('open');
      fsm.open();

      expect(fsm.is('opening')).toBeFalsy();
    });

    it('will not transition from saving to opening', function () {
      fsm.transition('saving');
      fsm.open();

      expect(fsm.is('opening')).toBeFalsy();
    });

    it('will not transition from savingFailed to opening', function () {
      fsm.transition('savingFailed');
      fsm.open();

      expect(fsm.is('opening')).toBeFalsy();
    });
  });

  describe('save', function () {
    it('transitions from open to saving', function () {
      fsm.transition('open');
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

    it('will not transition from opening to saving', function () {
      fsm.transition('opening');
      fsm.save();

      expect(fsm.is('saving')).toBeFalsy();
    });

    it('will not transition from openingFailed to saving', function () {
      fsm.transition('openingFailed');
      fsm.save();

      expect(fsm.is('saving')).toBeFalsy();
    });
  });

  describe('finish', function () {
    it('transitions from opening to open', function () {
      fsm.transition('opening');
      fsm.finish();

      expect(fsm.is('open')).toBeTruthy();
    });

    it('transitions from saving to closed', function () {
      fsm.transition('saving');
      fsm.finish();

      expect(fsm.is('closed')).toBeTruthy();
    });

    it('will not transition out of closed', function () {
      fsm.transition('closed');
      fsm.finish();

      expect(fsm.is('closed')).toBeTruthy();
    });

    it('will not transition out of open', function () {
      fsm.transition('open');
      fsm.finish();

      expect(fsm.is('open')).toBeTruthy();
    });

    it('will not transition out of openingFailed', function () {
      fsm.transition('openingFailed');
      fsm.finish();

      expect(fsm.is('openingFailed')).toBeTruthy();
    });

    it('will not transition out of savingFailed', function () {
      fsm.transition('savingFailed');
      fsm.finish();

      expect(fsm.is('savingFailed')).toBeTruthy();
    });
  });

  describe('fail', function () {
    it('transitions from opening to openingFailed', function () {
      fsm.transition('opening');
      fsm.fail();

      expect(fsm.is('openingFailed')).toBeTruthy();
    });

    it('transitions from saving to savingFailed', function () {
      fsm.transition('saving');
      fsm.fail();

      expect(fsm.is('savingFailed')).toBeTruthy();
    });

    it('will not transition out of closed', function () {
      fsm.transition('closed');
      fsm.fail();

      expect(fsm.is('closed')).toBeTruthy();
    });

    it('will not transition out of open', function () {
      fsm.transition('open');
      fsm.fail();

      expect(fsm.is('open')).toBeTruthy();
    });

    it('will not transition out of openingFailed', function () {
      fsm.transition('openingFailed');
      fsm.fail();

      expect(fsm.is('openingFailed')).toBeTruthy();
    });

    it('will not transition out of savingFailed', function () {
      fsm.transition('savingFailed');
      fsm.fail();

      expect(fsm.is('savingFailed')).toBeTruthy();
    });
  });

  describe('close', function () {
    it('transitions from opening to closed', function () {
      fsm.transition('opening');
      fsm.close();

      expect(fsm.is('closed')).toBeTruthy();
    });

    it('transitions from open to closed', function () {
      fsm.transition('open');
      fsm.close();

      expect(fsm.is('closed')).toBeTruthy();
    });

    it('transitions from openingFailed to closed', function () {
      fsm.transition('openingFailed');
      fsm.close();

      expect(fsm.is('closed')).toBeTruthy();
    });

    it('transitions from savingFailed to closed', function () {
      fsm.transition('savingFailed');
      fsm.close();

      expect(fsm.is('closed')).toBeTruthy();
    });

    it('will not transitions from saving to closed', function () {
      fsm.transition('saving');
      fsm.close();

      expect(fsm.is('closed')).toBeFalsy();
    });
  });
});
