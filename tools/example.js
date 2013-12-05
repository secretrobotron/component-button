(function() {

  var __channels = 0;

  document.addEventListener('WebComponentsReady', function (e) {

    var element = document.querySelector("*[data-analyze]");

    if (element && typeof element.ceci === 'object') {

      var gui = new dat.GUI();

      var broadcastsFolder = gui.addFolder('Broadcasts');
      var listenersFolder = gui.addFolder('Listeners');

      Object.keys(element.ceci.listeners).forEach(function (listenerKey) {
        var model = {};

        var listenerLabel = 'Send';
        var inputLabel = 'Value';
        var toggleControllerName = 'Listen';

        var listenerSubFolder = listenersFolder.addFolder(listenerKey);

        model[inputLabel] = element.getAttribute(listenerKey.substr(3)) || '';

        model[listenerLabel] = function (v) {
          var broadcastElement = document.querySelector('ceci-broadcast[from="Broadcast ' + listenerKey + '"]');
          if (broadcastElement) {
            broadcastElement.fire(model[inputLabel]);
          }
          else {
            console.error('No broadcast element for Broadcast ' + listenerKey + '.');
          }
        };

        listenerSubFolder.add(model, inputLabel);
        listenerSubFolder.add(model, listenerLabel);

        var channel = 'Channel ' + __channels++;

        var listenElement = document.createElement('ceci-listen');
        listenElement.setAttribute('for', listenerKey);
        listenElement.setAttribute('on', channel);

        var broadcastElement = document.createElement('ceci-broadcast');
        broadcastElement.setAttribute('from', 'Broadcast ' + listenerKey);
        broadcastElement.setAttribute('on', channel);

        document.body.appendChild(broadcastElement);

        model[toggleControllerName] = element.ceci.defaultListeners ? element.ceci.defaultListeners.indexOf(listenerKey) > -1 : false;

        var controller = listenerSubFolder.add(model, toggleControllerName);
        controller.onChange(function (value) {
          value ? element.appendChild(listenElement) : element.removeChild(listenElement);
        });

        if (model[toggleControllerName]) {
          listenerSubFolder.open();
        }
      });

      Object.keys(element.ceci.broadcasts).forEach(function (broadcastKey) {
        var model = {};
        var broadcastSubFolder = broadcastsFolder.addFolder(broadcastKey);
        var channel = 'Channel ' + __channels++;
        var broadcastLabel = 'Broadcast';
        model[broadcastLabel] = element.ceci.defaultBroadcasts ? element.ceci.defaultBroadcasts.indexOf(broadcastKey) > -1 : false;
        model['Output'] = '';
        var controller = broadcastSubFolder.add(model, broadcastLabel);
        var broadcastElement = element.querySelector('ceci-broadcast[from="' + broadcastKey + '"]') || document.createElement('ceci-broadcast');
        broadcastElement.setAttribute('from', broadcastKey);
        broadcastElement.setAttribute('on', channel);
        controller.onChange(function (value) {
          value ? element.appendChild(broadcastElement) : element.removeChild(broadcastElement);
        });

        var outputController = broadcastSubFolder.add(model, 'Output');

        document.addEventListener(channel, function (e) {
          model['Output'] = e.detail.data;
          outputController.updateDisplay();
        }, false);

        if (model[broadcastLabel]) {
          broadcastSubFolder.open();
        }
      });

      listenersFolder.open();
      broadcastsFolder.open();
    }
    else {
      console.error('No ceci element marked with data-analyze');
    }

  }, false);

})();