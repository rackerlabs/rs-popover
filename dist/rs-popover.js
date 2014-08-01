angular.module('rs.popover', []).run(function () {
  'use strict';

  var styleContent, styleTag;

  styleContent = document.createTextNode('.rs-popover-overlay { position: absolute; top: 0; left: 0; right: 0; bottom: 0; opacity: 0 } \
    .rs-popover-loading, .rs-popover-error { width: 200px; height: 140px } \
    .rs-popover-error { color: #c40022 } \
    .rs-popover-message { width: 100%; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center; } \
    .rs-popover-body { margin: 0; padding: 20px }');
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
    '    <div class="rs-popover-arrow rs-popover-arrow-top-left"></div>\n' +
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

  var VERTICAL_OFFSET = 11;
  var HORIZONTAL_OFFSET = -33;

  function Attachment(element, target) {
    this.element = element;
    this.target = target;
  }

  Attachment.prototype.position = function () {
    var position, popoverElement;

    position = this.target.offset();
    position.top += this.target.outerHeight() + VERTICAL_OFFSET;
    position.left += this.target.outerWidth() / 2 + HORIZONTAL_OFFSET;

    popoverElement = $('.rs-popover', this.element).first();
    popoverElement.css({ top: position.top, left: position.left });
  };

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
    '    <div class="rs-popover-arrow rs-popover-arrow-top-left"></div>\n' +
    '    <form class="rs-popover-content">\n' +
    '      <div class="rs-popover-error" ng-show="is(\'error\')">\n' +
    '        <div class="rs-popover-message">{{ state.message }}</div>\n' +
    '      </div>\n' +
    '      <div class="rs-popover-loading" ng-show="is(\'loading\')">\n' +
    '        <div class="rs-popover-message">{{ state.message }}</div>\n' +
    '      </div>\n' +
    '      <div class="rs-popover-body" ng-show="is(\'open\') || is(\'saving\')" ng-transclude></div>\n' +
    '      <div class="rs-popover-footer rs-btn-group" ng-show="is(\'open\') || is(\'saving\')">\n' +
    '        <button class="rs-btn rs-btn-primary" ng-disabled="is(\'saving\')" ng-click="save()">{{ saveLabel || \'Save\' }}</button>\n' +
    '        <button class="rs-btn rs-btn-link" ng-hide="is(\'saving\')" ng-click="close()">{{ cancelLabel || \'Cancel\' }}</button>\n' +
    '      </div>\n' +
    '    </form>\n' +
    '  </div>\n' +
    '</div>\n' +
    '');
}]);
})();

angular.module('rs.popover').controller('PopoverController', function ($scope, $element, registry, tether, PopoverState) {
  'use strict';

  function resetState() {
    var state;

    state = new PopoverState();
    state.on('open', $scope.onOpen || angular.noop);
    state.on('save', $scope.onSave || angular.noop);
    state.on('close', resetState);

    $scope.state = state;
  }

  this.id = $scope.id;
  registry.register($scope.id, $scope);
  resetState();

  $scope.$on('$destroy', function () {
    registry.deregister($scope.id);
  });

  $scope.is = function (state) {
    return $scope.state.is(state);
  };

  $scope.open = function (target) {
    $scope.state.open();
    tether.attach($element, target);
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
    $scope.state.save();
  };
});


angular.module('rs.popover').factory('PopoverState', function ($q) {
  'use strict';

  function PopoverState() {
    this.state = PopoverState.CLOSED;
    this.subscriptions = { open: [], load: [], error: [], save: [], close: [] };
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

  PopoverState.prototype.error = function (message) {
    this.message = message;
    this.state = PopoverState.ERROR;
    this.fire('error');
  };

  PopoverState.prototype.save = function () {
    this.state = PopoverState.SAVING;
    this.fire('save')
      .then(angular.bind(this, this.close))
      .catch(angular.bind(this, this.load));
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

  return PopoverState;
});

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
    transclude: true,
    templateUrl: 'rsPopoverForm.html'
  };
});

angular.module('rs.popover').directive('rsPopoverTrigger', function (registry) {
  'use strict';

  return {
    restrict: 'A',
    require: '?^rsPopover',
    link: function (scope, element, attrs, popoverController) {
      var id;

      if (attrs.rsPopoverTrigger) {
        id = attrs.rsPopoverTrigger;
      } else if (popoverController) {
        id = popoverController.id;
      } else {
        throw 'No popover ID was specified for popover trigger!';
      }

      element.on('click', function (e) {
        e.preventDefault();

        registry.popover(id).toggle(element);
        scope.$apply();
      });
    }
  };
});


angular.module('rs.popover').factory('tether', function ($window, Attachment) {
  'use strict';

  function Tether() {
    this.attachments = [];

    angular.element($window).on('resize scroll', angular.bind(this, this.reposition));
  }

  Tether.prototype.attach = function (element, target) {
    var attachment;

    attachment = new Attachment(element, target);
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
});

//# sourceMappingURL=rs-popover.js.map