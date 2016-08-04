import request from 'superagent'

class Amplitude {
  constructor (token, options = {}) {
    _checkForToken(token)

    this.token = token
    this.session_user_id = options.user_id
    this.session_device_id = options.device_id
  }

  track (data) {
    data.user_id = data.user_id || this.session_user_id
    data.device_id = data.device_id || this.session_device_id

    return this._postToApi(data)
  }

  _postToApi (data) {
    return request
      .post('https://api.amplitude.com/httpapi')
      .query({
        api_key: this.token,
        event: JSON.stringify(data)
      })
      .set('Accept', 'application/json')
      .then(res => res.body)
  }
}

function _checkForToken (token) {
  if (!token) throw new Error('No token provided')
}

export default Amplitude
