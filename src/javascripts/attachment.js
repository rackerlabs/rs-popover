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
