(function () {
  var buttonElement;
  var iframeWindow, iframeDocument;

  beforeEach(function (done) {
    harnessUtils.createIframe('test/html/test.html', function (win, doc) {
      buttonElement = doc.querySelector('ceci-button');
      iframeWindow = win;
      iframeDocument = doc;
      done();
    });
  });

  describe('Ceci Button', function () {

    test('Sanity check', function (done) {
      chai.assert(buttonElement.$.button, 'Button recognized and exposed by Polymer.');
      chai.assert(buttonElement.ceci, 'Ceci descriptor exists.');
      chai.assert(buttonElement.ceci.broadcasts, 'Ceci broadcasts publicized.');
      chai.assert(buttonElement.ceci.listeners, 'Ceci listeners publicized.');
      done();
    });

    test('Broadcasts', function (done) {
      harnessUtils.testBroadcasts(buttonElement, iframeDocument, done, {
        check: {
          click: function (e, channel) {
            chai.assert.equal(e.detail.data, 'you must construct additional pylons', 'Component attached correct value to event.');
            chai.assert.equal(e.detail.data, buttonElement.getAttribute('value'), 'Correct component broadcasted ' + channel + ' event.');
          }
        },
        execute: {
          click: function (channel) {
            var e = iframeDocument.createEvent('MouseEvents');
            e.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, true, false, false, true, 0, null);
            buttonElement.$.button.dispatchEvent(e);
          }
        }
      });
    });

    test('Listeners', function (done) {
      harnessUtils.testListeners(buttonElement, iframeWindow, iframeDocument, done, {
        check: {
          click: function (e, channel) {
            chai.assert(true, 'Click event occured.');
          },
          setLabel: function (e, channel) {
            chai.assert(true);
          }
        }
      });
    });
  });
})();
