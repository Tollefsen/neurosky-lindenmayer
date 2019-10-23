var express = require("express");
var neurosky = require("./neurosky");
var app = express();
const fs = require("fs");
const bodyparser = require("body-parser");

app.use(express.static(__dirname + "/"));
app.use(bodyparser.text({ limit: "9999mb", extended: true }));

app.post("/save/:email", function(req, res) {
  fs.writeFile(`./bilder/${req.params.email}.png`, req.body, "base64", function(
    err
  ) {
    if (err) throw err;
    console.log("fs.write callback");
  });
  res.send("OK");
});

app.get("/images", function(req, res) {
  const response = [];
  fs.readdir("./bilder", function(err, items) {
    console.log(items);
    items.forEach(e => response.push(e));

    res.json(response.filter(e => e !== ".DS_Store"));
  });
});

app.listen(3000, function() {
  console.log("[Express] Listening on port 3000");
});
