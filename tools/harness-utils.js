(function () {
  var __htmlbase = '';

  mocha.htmlbase = function (b) {__htmlbase = b;};

  window.harnessUtils = {
    createIframe: function (url, callback) {
      var iframe = document.createElement('iframe');

      function callbackWrapper () {
        callback(iframe.contentWindow, iframe.contentWindow.document);
      }

      iframe.onload = function (e) {
        iframe.contentWindow.document.addEventListener('WebComponentsReady', callbackWrapper, false);
      };

      iframe.src = __htmlbase + url;
      iframe.className = 'harness-instance';
      document.body.appendChild(iframe);
    },
    createBroadcastElement: function (doc, onAttribute, fromAttribute) {
      var el = doc.createElement('ceci-broadcast');
      el.setAttribute('on', onAttribute);
      el.setAttribute('from', fromAttribute);
      return el;
    },
    createListenElement: function (doc, onAttribute, forAttribute) {
      var el = doc.createElement('ceci-listen');
      el.setAttribute('on', onAttribute);
      el.setAttribute('for', forAttribute);
      return el;
    },
    testListeners: function (element, iframeWindow, iframeDocument, done, opts) {
      var listeners = element.ceci.listeners;
      var listenerKeys = Object.keys(listeners);
      var completedListeners = 0;

      var checkFunctions = opts.check || {};
      var executeFunctions = opts.execute || {};

      function checkForDone () {
        if (++completedListeners === listenerKeys.length) {
          done();
        }
      }

      listenerKeys.forEach(function (key, index) {
        var channel = 'Channel' + index;
        var listenElement = element.querySelector('ceci-listen[for="' + key + '"]');

        if (!listenElement) {
          listenElement = harnessUtils.createListenElement(iframeDocument, channel, key);
          element.appendChild(listenElement);
        }
        else {
          listenElement.setAttribute('on', channel);
        }

        iframeDocument.addEventListener(channel, function (e) {
          checkFunctions[key] && checkFunctions[key](e, channel);
          checkForDone();
        }, false);

        executeFunctions[key] = executeFunctions[key] || function () {
          var e = new iframeWindow.CustomEvent(channel, {detail: Math.random()} );
          iframeDocument.dispatchEvent(e);
        };

        executeFunctions[key]();
      });
    },
    testBroadcasts: function (element, iframeDocument, done, opts) {
      var broadcasts = element.ceci.broadcasts;
      var broadcastKeys = Object.keys(broadcasts);
      var completedBroadcasts = 0;

      var checkFunctions = opts.check || {};
      var executeFunctions = opts.execute || {};

      function checkForDone () {
        if (++completedBroadcasts === broadcastKeys.length) {
          done();
        }
      }

      broadcastKeys.forEach(function (key, index) {
        var channel = 'Channel' + index;
        var broadcastElement = element.querySelector('ceci-broadcast[from="' + key + '"]');

        if (!broadcastElement) {
          broadcastElement = harnessUtils.createBroadcastElement(iframeDocument, channel, key);
          element.appendChild(broadcastElement);
        }
        else {
          broadcastElement.setAttribute('on', channel);
        }

        iframeDocument.addEventListener(channel, function (e) {
          checkFunctions[key] && checkFunctions[key](e, channel);
          checkForDone();
        }, false);

        executeFunctions[key] && executeFunctions[key]();
      });
    }
  };
})();
