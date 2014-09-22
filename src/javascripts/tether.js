angular.module('rs.popover').factory('tether', function ($window, Attachment) {
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
});
