angular.module('rs.popover', []).run(function () {
  'use strict';

  var styleContent, styleTag;

  styleContent = document.createTextNode('.rs-popover-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; opacity: 0 } \
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
    '<div class="rs-popover-wrapper" ng-hide="is(\'closed\')">\n' +
    '  <div class="rs-popover-overlay" ng-click="close()"></div>\n' +
    '  <div class="rs-popover">\n' +
    '    <div ng-class="{{ styles }}"></div>\n' +
    '    <div class="rs-popover-content">\n' +
    '      <div class="rs-popover-error" ng-show="is(\'error\')">\n' +
    '        <div class="rs-popover-message">{{ state.message }}</div>\n' +
    '      </div>\n' +
    '      <div class="rs-popover-loading" ng-show="is(\'loading\')">\n' +
    '        <div class="rs-popover-message">{{ state.message }}</div>\n' +
    '      </div>\n' +
    '      <div class="rs-popover-body" ng-show="is(\'open\')" ng-transclude></div>\n' +
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
    '<div class="rs-popover-wrapper" ng-hide="is(\'closed\')">\n' +
    '  <div class="rs-popover-overlay" ng-click="close()"></div>\n' +
    '  <div class="rs-popover">\n' +
    '    <div ng-class="{{ styles }}"></div>\n' +
    '    <form name="form" class="rs-popover-content" novalidate>\n' +
    '      <div class="rs-popover-error" ng-show="is(\'error\')">\n' +
    '        <div class="rs-popover-message">{{ state.message }}</div>\n' +
    '      </div>\n' +
    '      <div class="rs-popover-loading" ng-show="is(\'loading\')">\n' +
    '        <div class="rs-popover-message">{{ state.message }}</div>\n' +
    '      </div>\n' +
    '      <div class="rs-popover-body" ng-show="is(\'open\') || is(\'saving\') || is(\'failed\')" ng-transclude></div>\n' +
    '      <div class="rs-popover-footer rs-btn-group" ng-show="is(\'open\') || is(\'saving\') || is(\'failed\')">\n' +
    '        <button class="rs-btn rs-btn-primary" ng-disabled="is(\'saving\')" ng-click="save()">{{ saveLabel || \'Save\' }}</button>\n' +
    '        <button class="rs-btn rs-btn-link" ng-hide="is(\'saving\') || is(\'failed\')" ng-click="close()">{{ cancelLabel || \'Cancel\' }}</button>\n' +
    '        <span class="rs-status-error" ng-show="is(\'failed\')">{{ state.message }}</span>\n' +
    '        <i class="rs-processing-indicator" ng-show="is(\'saving\')"></i>\n' +
    '      </div>\n' +
    '    </form>\n' +
    '  </div>\n' +
    '</div>\n' +
    '');
}]);
})();

angular.module('rs.popover').factory('focus', ["$timeout", function ($timeout) {
  'use strict';

  return function focus(element, invokeApply) {
    return $timeout(function () {
      var focusableElement;

      focusableElement = element.find(':input').first();
      focusableElement.focus();
    }, 0, invokeApply || false);
  };
}]);

angular.module('rs.popover').factory('form', function () {
  'use strict';

  function reset(element, form) {
    form.$setPristine();
  }

  function validate(element) {
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
  }

  return {
    reset: reset,
    validate: validate
  };
});

angular.module('rs.popover').controller('PopoverController', ["$scope", "$element", "registry", "form", "tether", "focus", "PopoverState", function ($scope, $element, registry, form, tether, focus, PopoverState) {
  'use strict';

  function resetState() {
    var state;

    state = new PopoverState();
    state.on('open', $scope.onOpen || angular.noop);
    state.on('save', $scope.onSave || angular.noop);
    state.on('close', resetState);
    state.on('close', function () {
      form.reset($element, $scope.form);
    });
    state.on('load', function () {
      focus($element);
    });

    $scope.state = state;
  }

  this.id = $scope.id;
  registry.register($scope.id, $scope);
  resetState();

  $scope.styles = {
    'rs-popover-arrow': true,
    'rs-popover-arrow-top-left': $scope.attach === 'top-left',
    'rs-popover-arrow-left-top': $scope.attach === 'left-top'
  };

  $scope.$on('$destroy', function () {
    registry.deregister($scope.id);
  });

  $scope.is = function (state) {
    return $scope.state.is(state);
  };

  $scope.open = function (target) {
    $scope.state.open();
    tether.attach($element, target, $scope.attach);
  };

  $scope.close = function () {
    $scope.state.close();
  };

  $scope.toggle = function (target) {
    if ($scope.state.is('closed')) {
      $scope.open(target);
    } else {
      $scope.close();
    }
  };

  $scope.save = function () {
    form.validate($element, $scope.form);

    if ($scope.form.$valid) {
      $scope.state.save();
    }
  };
}]);


angular.module('rs.popover').factory('PopoverState', ["$q", function ($q) {
  'use strict';

  function PopoverState() {
    this.state = PopoverState.CLOSED;
    this.subscriptions = { open: [], load: [], error: [], save: [], fail: [], close: [] };
  }

  PopoverState.prototype.is = function (state) {
    return this.state === state;
  };

  PopoverState.prototype.on = function (e, handler) {
    this.subscriptions[e].push(handler);
  };

  PopoverState.prototype.fire = function (e) {
    var promises = [];

    angular.forEach(this.subscriptions[e], function (handler) {
      promises.push(handler());
    });

    return $q.all(promises);
  };

  PopoverState.prototype.open = function () {
    this.message = 'Loading…';
    this.state = PopoverState.LOADING;
    this.fire('open')
      .then(angular.bind(this, this.load))
      .catch(angular.bind(this, this.error));
  };

  PopoverState.prototype.load = function () {
    this.state = PopoverState.OPEN;
    this.fire('load');
  };

  // TODO: This should accept an error instead of a message.
  PopoverState.prototype.error = function (message) {
    this.message = message;
    this.state = PopoverState.ERROR;
    this.fire('error');
  };

  PopoverState.prototype.save = function () {
    this.state = PopoverState.SAVING;
    this.fire('save')
      .then(angular.bind(this, this.close))
      .catch(angular.bind(this, this.fail));
  };

  PopoverState.prototype.fail = function (error) {
    this.message = error.toString();
    this.state = PopoverState.FAILED;
    this.fire('fail');
  };

  PopoverState.prototype.close = function () {
    this.state = PopoverState.CLOSED;
    this.fire('close');
  };

  PopoverState.CLOSED = 'closed';
  PopoverState.LOADING = 'loading';
  PopoverState.OPEN = 'open';
  PopoverState.ERROR = 'error';
  PopoverState.SAVING = 'saving';
  PopoverState.FAILED = 'failed';

  return PopoverState;
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
      attach: '@',
      onOpen: '='
    },
    restrict: 'EA',
    controller: 'PopoverController',
    transclude: true,
    templateUrl: 'rsPopover.html',
    compile: function (element, attributes) {
      attributes.attach = attributes.attach || 'top-left';
    }
  };
});

angular.module('rs.popover').directive('rsPopoverForm', function () {
  'use strict';

  return {
    scope: {
      id: '@',
      attach: '@',
      saveLabel: '@',
      cancelLabel: '@',
      onOpen: '=',
      onSave: '='
    },
    restrict: 'EA',
    controller: 'PopoverController',
    transclude: true,
    templateUrl: 'rsPopoverForm.html',
    compile: function (element, attributes) {
      attributes.attach = attributes.attach || 'top-left';
    }
  };
});

angular.module('rs.popover').directive('rsPopoverTrigger', ["registry", function (registry) {
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

  return {
    restrict: 'A',
    require: '?^rsPopover',
    link: function (scope, element, attrs, popoverController) {
      var id, target;

      id = findPopoverId(attrs, popoverController);
      target = findPopoverTarget(element, attrs);

      element.on('click', function (e) {
        e.preventDefault();

        registry.popover(id).toggle(target);
        scope.$apply();
      });
    }
  };
}]);


angular.module('rs.popover').factory('tether', ["$window", "Attachment", function ($window, Attachment) {
  'use strict';

  function Tether() {
    this.attachments = [];

    angular.element($window).on('resize scroll', angular.bind(this, this.reposition));
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