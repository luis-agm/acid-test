'use strict';

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _momentTimezone = require('moment-timezone');

var _momentTimezone2 = _interopRequireDefault(_momentTimezone);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _socket = require('socket.io');

var _socket2 = _interopRequireDefault(_socket);

var _redis = require('redis');

var _redis2 = _interopRequireDefault(_redis);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _finalhandler = require('finalhandler');

var _finalhandler2 = _interopRequireDefault(_finalhandler);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

require('babel-polyfill');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/******************************/
/** ******* Configs ***********/
/******************************/

var MAIN_INTERVAL = 3500; // Milliseconds
var PORT = process.env.PORT || 8080;
var publicDir = _path2.default.join(process.cwd(), 'react-ui', 'build'); // Public folder url to serve files from
var logger = (0, _morgan2.default)('dev');

_bluebird2.default.promisifyAll(_redis2.default.RedisClient.prototype);
_bluebird2.default.promisifyAll(_redis2.default.Multi.prototype);
var redis = _redis2.default.createClient(process.env.REDIS_URL);

redis.onAsync('error').then(function (error) {
  return console.log(error);
});

/***************************************/
/** ******* Request Handlers ***********/
/***************************************/

var mainHandler = function mainHandler(req, res) {
  return logger(req, res, function (err) {
    if (err) return (0, _finalhandler2.default)(req, res)(err);
    return serverRouter(req, res);
  });
};

var serverRouter = function serverRouter(req, res) {
  var basepath = req.url.split('/');
  basepath.shift();

  switch (basepath[0]) {
    case '':
      return serveView(req, res);
    case 'favicon.ico':
    case 'service-worker.js':
    case 'static':
      return staticFileHandler([].concat(_toConsumableArray(basepath)), req, res);
    default:
      return (0, _finalhandler2.default)(req, res)(false);
  }
};

var serveView = function serveView(req, res) {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  _fs2.default.createReadStream(_path2.default.join(publicDir, 'index.html')).pipe(res);
};

var staticFileHandler = function staticFileHandler(url, req, res) {
  var fileUrl = _path2.default.join.apply(_path2.default, [publicDir].concat(_toConsumableArray(url)));
  var extension = _path2.default.extname(fileUrl);
  var contentTypes = {
    '.map': 'application/octet-stream',
    '.ico': 'image/x-icon',
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.css': 'text/css',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml'
  };
  if (_fs2.default.existsSync(fileUrl)) {
    res.writeHead(200, { 'Content-Type': contentTypes[extension] });
    _fs2.default.createReadStream(fileUrl).pipe(res);
  } else {
    (0, _finalhandler2.default)(req, res)(false);
  }
};
/******************************/
/** ******* Helpers ***********/
/******************************/

var getStocks = function getStocks() {
  return _axios2.default.get('http://finance.google.com/finance/info?client=ig&q=AAPL,ABC,MSFT,TSLA,F').then(function (resp) {
    // Error faking
    if (Math.random() < 0.1) throw new Error('How unfortunate! The API Request Failed');
    var objectResponse = resp.data.substr(3); // remove weird double slash in response
    return JSON.parse(objectResponse);
  }).then(function (resp) {
    _lodash2.default.forEach(resp, function (stock) {
      // Using only hashes makes it hard to paginate. Using a list I could retrieve only a portion of the price history.
      // Only save new values
      redis.hexistsAsync('last', stock.id).then(function (res) {
        if (res === 0) {
          // If there's no last value, just store history and last value
          redis.hsetAsync(stock.id, stock.l, +(0, _momentTimezone2.default)()).then(function (res) {
            redis.hsetAsync('last', stock.id, stock.l);
          });
        } else {
          // If there is a last value, compare before saving
          redis.hgetAsync('last', stock.id).then(function (res) {
            if (res === stock.l) {
              // console.log( 'same as last' )
            } else {
              // console.log( `New price for ${stock.t}, ${stock.l}` )
              var timestamp = +(0, _momentTimezone2.default)();
              redis.hsetAsync(stock.id, stock.l, timestamp).then(function (res) {
                io.to('details-' + stock.id).emit('newPrice', { price: stock.l, date: timestamp });
                redis.hsetAsync('last', stock.id, stock.l);
              });
            }
          });
        }
      });
    });
    return resp;
  }).catch(function (err) {
    if (err.message === 'How unfortunate! The API Request Failed') return getStocks();
    return err;
  });
};

// USE THIS MAYBE?
var getStockHistory = function getStockHistory(id) {
  return redis.hgetallAsync(id).then(function (res) {
    return _lodash2.default.sortBy(_lodash2.default.map(res, function (val, key) {
      return { price: key, date: val };
    }), 'date');
  });
};
/***********************************/
/** ******* Server Setup ***********/
/***********************************/

var app = _http2.default.createServer(mainHandler);
app.listen(PORT);

console.log('Server running on port ' + PORT);

/** ******* Socket.io Stuff ***********/

var io = (0, _socket2.default)(app);

/** ********* Stocks Info *************/

// This are closing and opening hours for both NASDAQ and NYSE
var marketCloses = _momentTimezone2.default.tz('America/New_York').hours(16).minutes(0).seconds(0).format();
var marketOpens = _momentTimezone2.default.tz('America/New_York').hours(9).minutes(30).seconds(0).format();

var isMarketClosed = function isMarketClosed(time) {
  return time.isAfter(marketCloses) || time.isBefore(marketOpens);
};

var getAndSend = function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(socket) {
    var result;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return getStocks();

          case 2:
            result = _context.sent;

            if (result instanceof Error) {
              io.emit('APIerror');
              console.log('emitted error', result);
            } else if (socket) {
              socket.emit('firstResults', result);
              console.log('emitted first results');
            } else {
              io.emit('newResults', result);
              console.log('emitted results');
            }

          case 4:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function getAndSend(_x) {
    return _ref.apply(this, arguments);
  };
}();

io.on('connect', function (socket) {
  socket.on('getHistory', function () {
    var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(id) {
      var prices;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return getStockHistory(id);

            case 2:
              prices = _context2.sent;

              console.log('sending prices', id);
              socket.emit('priceHistory', prices);
              socket.join('details-' + id);

            case 6:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, undefined);
    }));

    return function (_x2) {
      return _ref2.apply(this, arguments);
    };
  }());
  socket.on('stopUpdatingHistory', function (id) {
    socket.leave('details-' + id);
  });
  console.log('New connection: ', socket.id);
  if (isMarketClosed((0, _momentTimezone2.default)())) {
    socket.emit('marketClosed');
  }
  getAndSend(socket);
});

setInterval(function () {
  if (!isMarketClosed((0, _momentTimezone2.default)())) {
    // Wait till market opens or 'moment().hours( 12 )'
    io.clients(function () {
      var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(err, clients) {
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                if (err) {
                  _context3.next = 4;
                  break;
                }

                if (clients.length > 0) {
                  // Don't make the call and event if nobody is listening
                  getAndSend();
                }
                _context3.next = 5;
                break;

              case 4:
                throw new Error(err);

              case 5:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, undefined);
      }));

      return function (_x3, _x4) {
        return _ref3.apply(this, arguments);
      };
    }());
  }
}, MAIN_INTERVAL);