var express = require('express')
var app = express();
var path = require('path');

var distPath = "build/";

app.get('*/$', function(req, res) {
    res.sendFile(path.join(__dirname, distPath, req.path + "index.html"));
})

app.get('/*', function (req, res) {
  console.log(req.params);
  res.sendFile(path.join(__dirname, distPath, req.path));
})

app.listen(80, function () {
  console.log('listening on port 80!')
})
