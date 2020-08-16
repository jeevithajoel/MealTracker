var express = require('express');
var app = express();

app.use(express.static(__dirname)); // Current directory is root
app.listen(process.env.PORT || 5000);