var express = require("express");
var neurosky = require("./neurosky");
var app = express();

app.use(express.static(__dirname + "/"));

app.listen(3000, function() {
  console.log("[Express] Listening on port 3000");
});
