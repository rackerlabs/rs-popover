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
