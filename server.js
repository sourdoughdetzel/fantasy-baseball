var subdomain = require('express-subdomain');
const express = require('express');
const favicon = require('serve-favicon');

const app = express();

const path = require('path');

var router = express.Router();
 
//api specific routes 
router.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'dist/index.html'))
});

app.use(favicon(__dirname + '/dist/favicon.ico'));
app.use(express.static(__dirname + '/dist'));

app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

app.use(subdomain('baseball', router));

// Start the app by listening on the default
// Heroku port
app.listen(process.env.PORT || 8080);