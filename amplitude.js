'use strict'

var request = require('superagent')

var camelCaseToSnakeCasePropertyMap = Object.freeze({
  userId: 'user_id',
  deviceId: 'device_id',
  eventType: 'event_type',
  eventProperties: 'event_properties',
  userProperties: 'user_properties',
  appVersion: 'app_version',
  osName: 'os_name',
  deviceBrand: 'device_brand',
  deviceManufacturer: 'device_manufacturer',
  deviceModel: 'device_model',
  deviceType: 'device_type',
  locationLat: 'location_lat',
  locationLng: 'location_lng'
})

function Amplitude (token, options) {
  if (!token) {
    throw new Error('No token provided')
  }

  options = options || {}

  this.token = token
  this.secretKey = options.secretKey
  this.userId = options.userId || options.user_id
  this.deviceId = options.deviceId || options.device_id
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
  var sendData = Object.keys(data).reduce(function (obj, key) {
    var transformedKey = camelCaseToSnakeCasePropertyMap[key] || key

    obj[transformedKey] = data[key]

    return obj
  }, {})

  sendData.user_id = sendData.user_id || this.userId
  sendData.device_id = sendData.device_id || this.deviceId

  return this._postEvent(sendData)
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
