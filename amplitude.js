'use strict'

var request = require('superagent')

function Amplitude (token, options) {
  if (!token) {
    throw new Error('No token provided')
  }

  options = options || {}

  this.token = token
  this.session_user_id = options.user_id
  this.session_device_id = options.device_id
}

Amplitude.prototype._postToAPI = function (data) {
  return request
    .post('https://api.amplitude.com/httpapi')
    .query({
      api_key: this.token,
      event: JSON.stringify(data)
    })
    .set('Accept', 'application/json')
    .then(res => res.body)
}

Amplitude.prototype.track = function (data) {
  data.user_id = data.user_id || this.session_user_id
  data.device_id = data.device_id || this.session_device_id

  return this._postToAPI(data)
}

module.exports = Amplitude
