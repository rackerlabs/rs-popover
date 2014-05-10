var VERTICAL_OFFSET = 11;
var HORIZONTAL_OFFSET = -33;

function Tether() {
  'use strict';
}

Tether.prototype.attach = function (target, attachment) {
  'use strict';

  var position, popoverElement;

  position = target.offset();
  position.top += target.outerHeight() + VERTICAL_OFFSET;
  position.left += target.outerWidth() / 2 + HORIZONTAL_OFFSET;

  popoverElement = attachment.find('.rs-popover').first();
  popoverElement.css({ top: position.top, left: position.left });
};

module.exports = Tether;
