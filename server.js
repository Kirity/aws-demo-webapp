'use strict';

const express = require('express');

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

var os = require("os");
var hostname = os.hostname();
var version = 2
// App
const app = express();
app.get('/', (req, res) => {
  res.send('Application version = '+version+' and hostname = '+ hostname);
});

app.listen(PORT, HOST);
console.log(`Application version = ${version}, hostname = ${hostname}, running on http://${HOST}:${PORT}`);
