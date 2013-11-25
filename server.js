var express = require('express');
var path = require('path');
var app = express();
var open = require('open');
var root = __dirname+'/../';
app.use(express.static(root));
var PORT = '9898'
// app.use(express.logger());
var URL = 'http://localhost:'+PORT+'/'+path.basename(__dirname)+'/index.html';
console.log('serving test runner at ' + URL);
console.log('opening browser to see…');
console.log('hit ctrl-c to stop.');
open(URL);
app.listen(PORT);
