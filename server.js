var express = require('express'),
    request = require('request'),
    http = require('http');

var argv = require('optimist').argv;

var app = express();

// in offline mode, serve the test assets from the appmaker/serve_test_assets.js server.
// http://localhost:4321

var TEST_URL = "http://localhost:4321/";
var areOffline = false;
if (argv.o) {
  console.log("The internet isn't around, so we'll get testing assets from:\n  ", TEST_URL);
  areOffline = true;
}

var PORT = '1234';
console.log("\n\nWe are serving your component test page at: http://localhost:" + PORT); 

if (areOffline) {
  app.use(function (req, res, next) {
    var regex = /<link rel="import" href="..\/(.*)\/component.html">/g;
    var write = res.write;
      res.write = function(chunk, encoding){
        var s = String(chunk);
        s = s.split('https://appmaker.mozillalabs.com/test_assets/').join(TEST_URL);
        s = s.replace(regex, function (match, p1) {
            return '<link rel="import" href="/component/' + p1 + '/component.html">';
        });
        return write.call(res, s, encoding);
      };
    next();
  });
}

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}
app.use(allowCrossDomain);

app.get('/component/:id/component.html', function(req, res) {
  var componentName = req.params['id'];
  var url = "http://mozilla-appmaker.github.io/" + componentName + "/component.html";
  if (url) {
    try {
      request.get(url).on('error',
        function(err) { console.log('error doing cors request for ', url);})
      .pipe(res)
      .on('error',
        function(err) { console.log('error doing cors request for ', url);});
    } catch (e) {
      console.log("got exception doing the pipe", e);
      res.json({message: 'No valid url.'}, 500);
      return;
    }
  }
  else {
    res.json({error: 'No valid url.'}, 500);
  }
});

app.use(express.static(__dirname));

app.listen(PORT);
