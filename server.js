var express = require('express');
var app = express();
var argv = require('optimist').argv;

// in offline mode, serve the test assets from the appmaker/serve_test_assets.js server.
// http://localhost:4321

var TEST_URL = "http://localhost:4321/";
var areOffline = false;
console.log (argv.o);
if (argv.o) {
	console.log("The internet isn't around, so we'll get testing assets from:\n  ", TEST_URL);
	areOffline = true;
}

if (areOffline) {
	app.use(function (req, res, next) {
		var write = res.write;
	    res.write = function(chunk, encoding){
	    	var s = String(chunk).split('https://appmaker.mozillalabs.com/test_assets/').join(TEST_URL);
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
app.use(express.static(__dirname));
app.listen(1234);
