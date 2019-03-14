var express = require('express');

var app = express();
app.use(express.static(__dirname + "/src"));
app.get('/', function(req, res) {
    console.log('get /')
    res.render('index', { layout: false });
});
// app.listen(8080);

module.exports = app;