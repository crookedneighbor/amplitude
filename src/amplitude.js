import Q from 'q';
import request from 'superagent';

class Amplitude {
  constructor(token, options={}) {
    _checkForToken(token);

    this.token = token;
    this.session_user_id = options.user_id;
    this.session_device_id = options.device_id;
  }

  track(data) {
    data.user_id = data.user_id || this.session_user_id ;
    data.device_id = data.device_id || this.session_device_id ;
    return Q.Promise((resolve, reject) => {
      _postToApi(this.token, data, resolve, reject);
    });
  }
}

function _checkForToken(token) {
  if (!token) throw 'No token provided';
}

function _postToApi(token, data, resolve, reject) {
  request
    .post('https://api.amplitude.com/httpapi')
    .query({
      api_key: token,
      event: JSON.stringify(data)
    })
    .set('Accept', 'application/json')
    .end((err, res) => {
      if (err) {
        var name = data.user_id || data.device_id;
        return reject(err);
      }
      resolve(res.body);
  });
}

export default Amplitude;
