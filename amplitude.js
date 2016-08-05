'use strict'

var request = require('superagent')

function Amplitude (token, options) {
  if (!token) {
    throw new Error('No token provided')
  }

  options = options || {}

  this.token = token
  this.secretKey = options.secretKey
  this.session_user_id = options.user_id
  this.session_device_id = options.device_id
}

Amplitude.prototype._postEvent = function (data) {
  return request.post('https://api.amplitude.com/httpapi')
    .query({
      api_key: this.token,
      event: JSON.stringify(data)
    })
    .set('Accept', 'application/json')
    .then(res => res.body)
}

Amplitude.prototype._getExport = function (data) {
  return request.get('https://amplitude.com/api/2/export')
    .auth(this.token, this.secretKey)
    .query({
      start: data.start,
      end: data.end
    })
}

Amplitude.prototype.track = function (data) {
  data.user_id = data.user_id || this.session_user_id
  data.device_id = data.device_id || this.session_device_id

  return this._postEvent(data)
}

Amplitude.prototype.export = function (options) {
  options = options || {}

  if (!this.secretKey) {
    throw new Error('secretKey must be set to use the export method')
  }

  if (!options.start || !options.end) {
    throw new Error('`start` and `end` are required options')
  }

  return this._getExport(options)
}

module.exports = Amplitude
