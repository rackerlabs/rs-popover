angular.module('rs.popover', []).run(function () {
  'use strict';

  var styleContent, styleTag;

  styleContent = document.createTextNode('.rs-popover-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; opacity: 0 } \
    .rs-popover-content { display: block; } \
    .rs-popover-loading, .rs-popover-error { width: 200px; height: 140px } \
    .rs-popover-error { color: #c40022 } \
    .rs-popover-message { width: 100%; position: absolute; top: 50%; left: 50%; -moz-transform: translate(-50%, -50%); -ms-transform: translate(-50%, -50%); -webkit-transform: translate(-50%, -50%); transform: translate(-50%, -50%); text-align: center; } \
    .rs-popover-body { margin: 0; padding: 20px } \
    .rs-popover-footer > .rs-status-error { float: left; margin-top: 3px; } \
    .rs-popover-footer > .rs-processing-indicator { margin-top: 5px; }'
    );
  styleTag = document.createElement('style');
  styleTag.type = 'text/css';
  styleTag.appendChild(styleContent);

  document.head.appendChild(styleTag);
});

(function(module) {
try {
  module = angular.module('rs.popover');
} catch (e) {
  module = angular.module('rs.popover', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('rsPopover.html',
    '<div class="rs-popover-wrapper" ng-hide="ctrl.is(\'closed\')">\n' +
    '  <div class="rs-popover-overlay" ng-click="ctrl.close()"></div>\n' +
    '  <div class="rs-popover">\n' +
    '    <div ng-class="ctrl.arrow()"></div>\n' +
    '    <div class="rs-popover-content">\n' +
    '      <div class="rs-popover-loading" ng-show="ctrl.is(\'opening\')">\n' +
    '        <div class="rs-popover-message">Loading&hellip;</div>\n' +
    '      </div>\n' +
    '      <div class="rs-popover-error" ng-show="ctrl.is(\'openingFailed\')">\n' +
    '        <div class="rs-popover-message">{{ ctrl.error() }}</div>\n' +
    '      </div>\n' +
    '      <div class="rs-popover-body" ng-show="ctrl.is(\'open\')" ng-transclude></div>\n' +
    '    </div>\n' +
    '  </div>\n' +
    '</div>\n' +
    '');
}]);
})();

angular.module('rs.popover').factory('Attachment', function () {
  'use strict';

  var ARROW_SIZE = 11;
  var ARROW_OFFSET = -33;

  function Attachment(element, target, attachmentPoint) {
    this.element = element;
    this.target = target;
    this.attachmentPoint = attachmentPoint;
  }

  Attachment.prototype.position = function () {
    var position, popoverElement;

    position = this.target.offset();

    if (this.attachmentPoint === Attachment.TOP_LEFT) {
      position.top += this.target.outerHeight() + ARROW_SIZE;
      position.left += this.target.outerWidth() / 2 + ARROW_OFFSET;
    } else {
      position.top += this.target.outerHeight() / 2 + ARROW_OFFSET;
      position.left += this.target.outerWidth() + ARROW_SIZE;
    }

    popoverElement = $('.rs-popover', this.element).first();
    popoverElement.css({ top: position.top, left: position.left });
  };

  Attachment.LEFT_TOP = 'left-top';
  Attachment.TOP_LEFT = 'top-left';

  return Attachment;
});

(function(module) {
try {
  module = angular.module('rs.popover');
} catch (e) {
  module = angular.module('rs.popover', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('rsPopoverForm.html',
    '<div class="rs-popover-wrapper" ng-hide="ctrl.is(\'closed\')">\n' +
    '  <div class="rs-popover-overlay" ng-click="ctrl.close()"></div>\n' +
    '  <div class="rs-popover">\n' +
    '    <div ng-class="ctrl.arrow()"></div>\n' +
    '    <form name="form" class="rs-popover-content" novalidate>\n' +
    '      <div class="rs-popover-loading" ng-show="ctrl.is(\'opening\')">\n' +
    '        <div class="rs-popover-message">Loading&hellip;</div>\n' +
    '      </div>\n' +
    '      <div class="rs-popover-error" ng-show="ctrl.is(\'openingFailed\')">\n' +
    '        <div class="rs-popover-message">{{ ctrl.error() }}</div>\n' +
    '      </div>\n' +
    '      <div class="rs-popover-body" ng-show="ctrl.is(\'open\') || ctrl.is(\'saving\') || ctrl.is(\'savingFailed\')" ng-transclude></div>\n' +
    '      <div class="rs-popover-footer rs-btn-group" ng-show="ctrl.is(\'open\') || ctrl.is(\'saving\') || ctrl.is(\'savingFailed\')">\n' +
    '        <button class="rs-btn rs-btn-primary" ng-disabled="ctrl.is(\'saving\')" ng-click="ctrl.save()">{{ saveLabel || \'Save\' }}</button>\n' +
    '        <button class="rs-btn rs-btn-link" ng-hide="ctrl.is(\'saving\') || ctrl.is(\'savingFailed\')" ng-click="ctrl.close()">{{ cancelLabel || \'Cancel\' }}</button>\n' +
    '        <span class="rs-status-error" ng-show="ctrl.is(\'savingFailed\')">{{ ctrl.error() }}</span>\n' +
    '        <i class="rs-processing-indicator" ng-show="ctrl.is(\'saving\')"></i>\n' +
    '      </div>\n' +
    '    </form>\n' +
    '  </div>\n' +
    '</div>\n' +
    '');
}]);
})();

angular.module('rs.popover').factory('form', ["$timeout", function ($timeout) {
  'use strict';

  function reset(form) {
    form.$setPristine();
  }

  function validate(form, element) {
    element = angular.element(element);
    element.find(':input').each(function (i, element) {
      var controller;

      element = angular.element(element);
      controller = element.controller('ngModel');

      if (!controller) {
        return;
      }

      /*
      HACK: We need a way to force validation on fields that haven't been
      interacted with, so we change the view value from `undefined` to an empty
      string using $setViewValue. However, this only works the first time
      validation is forced, so we need to alternate between setting `undefined`
      and an empty string.
      */
      if (controller.$viewValue === undefined) {
        controller.$setViewValue('');
      } else if (controller.$viewValue === '') {
        controller.$setViewValue(undefined);
      }

      controller.$commitViewValue();
    });

    return form.$valid;
  }

  function focus(element, invokeApply) {
    return $timeout(function () {
      var focusableElement;

      focusableElement = element.find(':input').first();
      focusableElement.focus();
    }, 0, invokeApply || false);
  }

  return {
    reset: reset,
    validate: validate,
    focus: focus
  };
}]);

angular.module('rs.popover').controller('PopoverController', ["$scope", "$element", "$q", "PopoverStateMachine", "form", "registry", "tether", function ($scope, $element, $q, PopoverStateMachine, form, registry, tether) {
  'use strict';

  function executeHook(self, hook, fsm, ctx) {
    var result;

    hook = hook || angular.noop;
    result = hook(ctx.data);

    return $q.when(result).then(function () {
      fsm.finish();
    }, function (err) {
      self.errorMessage = err.toString();
      fsm.fail();
    });
  }

  this.is = function (state) {
    return this.fsm.is(state);
  };

  this.open = function (target, corner, data) {
    this.fsm.setContext({ element: $element, target: target, corner: corner, data: data });
    this.fsm.open();
  };

  this.save = function () {
    if (form.validate($scope.form, $element)) {
      this.fsm.save();
    }
  };

  this.close = function () {
    this.fsm.close();
  };

  this.toggle = function () {
    var handler;

    handler = this.is('closed') ? this.open : this.close;
    handler.apply(this, arguments);
  };

  this.arrow = function () {
    var context, corner;

    context = this.fsm.context;
    corner = context.corner;

    return {
      'rs-popover-arrow': true,
      'rs-popover-arrow-top-left': corner === 'top-left',
      'rs-popover-arrow-left-top': corner === 'left-top'
    };
  };

  this.error = function () {
    return this.errorMessage;
  };

  this.onOpen = function (fsm, ctx) {
    tether.attach(ctx.element, ctx.target, ctx.corner);

    return executeHook(this, $scope.onOpen, fsm, ctx);
  };

  this.onLoad = function (fsm, ctx) {
    form.focus(ctx.element);
  };

  this.onSave = function (fsm, ctx) {
    return executeHook(this, $scope.onSave, fsm, ctx);
  };

  this.onClose = function (fsm, ctx) {
    if ($scope.form) {
      form.reset($scope.form);
    }

    tether.detach(ctx.element);
  };

  this.id = $scope.id;
  this.fsm = new PopoverStateMachine();
  this.fsm.on('opening', angular.bind(this, this.onOpen));
  this.fsm.on('open', angular.bind(this, this.onLoad));
  this.fsm.on('saving', angular.bind(this, this.onSave));
  this.fsm.on('closed', angular.bind(this, this.onClose));
  this.$parent = $scope.$parent;

  registry.register(this.id, this);

  $scope.$on('$destroy', function () {
    registry.deregister($scope.id);
  });
}]);

angular.module('rs.popover').factory('PopoverStateMachine', ["$q", function ($q) {
  'use strict';

  var OPENING = 'opening';
  var OPENING_FAILED = 'openingFailed';
  var OPEN = 'open';
  var SAVING = 'saving';
  var SAVING_FAILED = 'savingFailed';
  var CLOSED = 'closed';

  function PopoverStateMachine() {
    this.context = {};
    this.state = CLOSED;

    this.subscriptions = {};
    this.subscriptions[OPENING] = [];
    this.subscriptions[OPENING_FAILED] = [];
    this.subscriptions[OPEN] = [];
    this.subscriptions[SAVING] = [];
    this.subscriptions[SAVING_FAILED] = [];
    this.subscriptions[CLOSED] = [];
  }

  PopoverStateMachine.prototype.setContext = function (context) {
    this.context = context;
  };

  PopoverStateMachine.prototype.is = function (state) {
    return this.state === state;
  };

  PopoverStateMachine.prototype.on = function (e, handler) {
    this.subscriptions[e].push(handler);
  };

  PopoverStateMachine.prototype.transition = function (state) {
    var promises = [];

    this.state = state;
    this.subscriptions[state].forEach(function (handler) {
      promises.push(handler(this, this.context));
    }, this);

    return $q.all(promises);
  };

  PopoverStateMachine.prototype.open = function () {
    if (this.is(CLOSED) || this.is(OPENING_FAILED)) {
      this.transition(OPENING);
    }
  };

  PopoverStateMachine.prototype.save = function () {
    if (this.is(OPEN) || this.is(SAVING_FAILED)) {
      this.transition(SAVING);
    }
  };

  PopoverStateMachine.prototype.finish = function () {
    if (this.is(OPENING)) {
      this.transition(OPEN);
    } else if (this.is(SAVING)) {
      this.transition(CLOSED);
    }
  };

  PopoverStateMachine.prototype.fail = function () {
    if (this.is(OPENING)) {
      this.transition(OPENING_FAILED);
    } else if (this.is(SAVING)) {
      this.transition(SAVING_FAILED);
    }
  };

  PopoverStateMachine.prototype.close = function () {
    if (this.is(SAVING)) {
      return;
    }

    this.transition(CLOSED);
  };

  return PopoverStateMachine;
}]);

angular.module('rs.popover').factory('registry', function () {
  'use strict';

  function Registry() {
    this.popovers = {};
  }

  Registry.prototype.register = function (id, scope) {
    if (!id) {
      throw 'Popover ID must not be empty!';
    } else if (id in this.popovers) {
      throw 'Popover ID "' + id + '" has already been registered!';
    }

    this.popovers[id] = scope;
  };

  Registry.prototype.deregister = function (id) {
    if (id in this.popovers) {
      delete this.popovers[id];
    } else {
      throw 'Popover ID "' + id + '" has not been registered!';
    }
  };

  Registry.prototype.popover = function (id) {
    if (id in this.popovers) {
      return this.popovers[id];
    }

    throw 'Popover ID "' + id + '" has not been registered!';
  };

  return new Registry();
});

angular.module('rs.popover').directive('rsPopover', function () {
  'use strict';

  return {
    scope: {
      id: '@',
      onOpen: '='
    },
    restrict: 'EA',
    controller: 'PopoverController',
    controllerAs: 'ctrl',
    transclude: true,
    templateUrl: 'rsPopover.html'
  };
});

angular.module('rs.popover').directive('rsPopoverForm', function () {
  'use strict';

  return {
    scope: {
      id: '@',
      saveLabel: '@',
      cancelLabel: '@',
      onOpen: '=',
      onSave: '='
    },
    restrict: 'EA',
    controller: 'PopoverController',
    controllerAs: 'ctrl',
    transclude: true,
    templateUrl: 'rsPopoverForm.html'
  };
});

angular.module('rs.popover').directive('rsPopoverTrigger', ["registry", "Attachment", function (registry, Attachment) {
  'use strict';

  function findPopoverId(attrs, popoverController) {
    if (attrs.rsPopoverTrigger) {
      return attrs.rsPopoverTrigger;
    } else if (popoverController) {
      return popoverController.id;
    }

    throw 'No popover ID was specified for popover trigger!';
  }

  function findPopoverTarget(element, attrs) {
    if (attrs.rsPopoverTarget) {
      return angular.element('#' + attrs.rsPopoverTarget);
    }

    return element;
  }

  function findPopoverCorner(attrs) {
    if (attrs.rsPopoverAttach) {
      return attrs.rsPopoverAttach;
    }

    return Attachment.TOP_LEFT;
  }

  function evalPopoverData(scope, attrs) {
    if (attrs.rsPopoverData) {
      return scope.$eval(attrs.rsPopoverData);
    }

    return {};
  }

  return {
    restrict: 'A',
    require: '?^rsPopover',
    link: function (scope, element, attrs, popoverController) {
      var id, target, corner, data;

      id = findPopoverId(attrs, popoverController);
      target = findPopoverTarget(element, attrs);
      corner = findPopoverCorner(attrs);
      data = evalPopoverData(scope, attrs);

      element.on('click', function (e) {
        e.preventDefault();

        registry.popover(id).toggle(target, corner, data);
        scope.$apply();
      });
    }
  };
}]);


angular.module('rs.popover').factory('tether', ["$window", "Attachment", function ($window, Attachment) {
  'use strict';

  function Tether() {
    this.attachments = [];

    angular.element($window).on('resize', angular.bind(this, this.reposition));
  }

  Tether.prototype.attach = function (element, target, attachmentPoint) {
    var attachment;

    attachment = new Attachment(element, target, attachmentPoint);
    attachment.position();

    this.attachments.push(attachment);

    return attachment;
  };

  Tether.prototype.reposition = function () {
    angular.forEach(this.attachments, function (attachment) {
      attachment.position();
    });
  };

  Tether.prototype.detach = function (element) {
    var index;

    angular.forEach(this.attachments, function (attachment, i) {
      if (attachment.element === element) {
        index = i;
      }
    });

    this.attachments.splice(index, 1);
  };

  return new Tether();
}]);

//# sourceMappingURL=rs-popover.js.map