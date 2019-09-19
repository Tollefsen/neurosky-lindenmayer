var express = require('express');
var neurosky = require('./neurosky');
var app = express();

app.use(express.static(__dirname + '/../client/'));
app.use(express.static(__dirname + '/../bower_components/'));

app.listen(3000, function () {
    console.log('[Express] Listening on port 3000');
});