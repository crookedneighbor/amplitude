let request = require('superagent');

class Amplitude {
  constructor(token, options={}) {
    _checkForToken(token);

    this.token = token;
    this.session_user_id = options.user_id;
    this.session_device_id = options.device_id;
  }

  track(data, cb) {
    data.user_id = data.user_id || this.session_user_id ;
    data.device_id = data.device_id || this.session_device_id ;
    _postToApi(this.token, data, cb);
  }
}

function _checkForToken(token) {
  if (!token) throw 'No token provided';
}

function _postToApi(token, data, cb) {
  request
    .post('https://api.amplitude.com/httpapi')
    .query({
      api_key: token,
      event: JSON.stringify(data)
    })
    .set('Accept', 'application/json')
    .end(function(err, res){
      if (err) {
        var name = data.user_id || data.device_id;
        console.error('There was a problem tracking "'
          + data.event_type + '" for "' + name + '"; ' + err);
      }
      cb(err);
    });
}

export default Amplitude;
