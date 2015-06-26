'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var request = require('superagent');

var Amplitude = (function () {
  function Amplitude(token, options) {
    _classCallCheck(this, Amplitude);

    options = options || {};
    _checkForToken(token);
    _checkForId(options);

    this.token = token;
    this.session_user_id = options.user_id;
    this.session_device_id = options.device_id;
  }

  _createClass(Amplitude, [{
    key: 'track',
    value: function track(data, cb) {
      data.user_id = this.session_user_id;
      data.device_id = this.session_device_id;
      _postToApi(this.token, data, cb);
    }
  }]);

  return Amplitude;
})();

function _checkForToken(token) {
  if (!token) {
    throw 'No token provided';
  }
}

function _checkForId(opt) {
  if (!opt.user_id && !opt.device_id) {
    throw 'Missing user_id or device_id';
  }
}

function _postToApi(token, data, cb) {
  request.post('https://api.amplitude.com/httpapi').query({
    api_key: token,
    event: JSON.stringify(data)
  }).set('Accept', 'application/json').end(function (err, res) {
    if (err) {
      console.error('There was a problem tracking "' + data.event_type + '" for "' + data.user_id + '"; ' + err);
    }
    cb(err, res);
  });
}

module.exports = exports.Amplitude = Amplitude;