'use strict';

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _nunjucks = require('nunjucks');

var _nunjucks2 = _interopRequireDefault(_nunjucks);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_nunjucks2.default.configure(_path2.default.resolve('..', 'views'), { autoescape: true });

var mainHandler = function mainHandler(req, res) {
  var response = _nunjucks2.default.render('index.njk');

  res.writeHead(200, { 'Content-Type': 'text/html' });

  res.end(response);
};

_http2.default.createServer(mainHandler).listen(8080, 'localhost');

console.log('Server running on port 8080');