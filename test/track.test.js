'use strict'

const nock = require('nock')
const Amplitude = require('../amplitude')

function generateMockedRequest (event, status) {
  let mockedRequest = nock('https://api.amplitude.com')
    .post('/httpapi')
    .reply(status, { some: 'data' })

  return mockedRequest
}

describe('track', function () {
  beforeEach(function () {
    this.amplitude = new Amplitude('token', {
      user_id: 'unique_user_id',
      device_id: 'unique_device_id'
    })

    this.data = {
      event_type: 'event'
    }

    this.event = {
      event_type: 'event',
      user_id: 'unique_user_id',
      device_id: 'unique_device_id'
    }
  })

  it('resolves when the request succeeds', function () {
    let mockedRequest = generateMockedRequest(this.event, 200)

    return this.amplitude.track(this.data).then((res) => {
      expect(res).to.eql({ some: 'data' })
      mockedRequest.done()
    }).catch((err) => {
      expect(err).to.equal(undefined)
    })
  })

  it('can pass data as camelcase and it will be autoformatted to snake case for the request', function () {
    let event = {
      event_type: 'event',
      user_id: 'different_user_id',
      device_id: 'different_device_id',
      event_properties: 'foo',
      user_properties: 'bar',
      app_version: 'baz',
      os_name: 'biz',
      device_brand: 'buz',
      device_manufacturer: 'bees',
      device_model: 'bus',
      device_type: 'barz',
      location_lat: 'up',
      location_lng: 'down'
    }
    let data = {
      eventType: 'event',
      userId: 'different_user_id',
      deviceId: 'different_device_id',
      eventProperties: 'foo',
      userProperties: 'bar',
      appVersion: 'baz',
      osName: 'biz',
      deviceBrand: 'buz',
      deviceManufacturer: 'bees',
      deviceModel: 'bus',
      deviceType: 'barz',
      locationLat: 'up',
      locationLng: 'down'
    }
    let mockedRequest = generateMockedRequest(event, 200)

    return this.amplitude.track(data).then((res) => {
      expect(res).to.eql({ some: 'data' })
      mockedRequest.done()
    }).catch((err) => {
      expect(err).to.equal(undefined)
    })
  })

  it('can override the user id set on initialization', function () {
    this.event = {
      event_type: 'event',
      user_id: 'another_user_id',
      device_id: 'unique_device_id'
    }
    this.data.user_id = 'another_user_id'
    let mockedRequest = generateMockedRequest(this.event, 200)

    return this.amplitude.track(this.data).then((res) => {
      expect(res).to.eql({ some: 'data' })
      mockedRequest.done()
    }).catch((err) => {
      expect(err).to.equal(undefined)
    })
  })

  it('can override the device id set on initialization', function () {
    this.event = {
      event_type: 'event',
      device_id: 'another_device_id',
      user_id: 'unique_user_id'
    }
    this.data.device_id = 'another_device_id'
    let mockedRequest = generateMockedRequest(this.event, 200)

    return this.amplitude.track(this.data).then((res) => {
      expect(res).to.eql({ some: 'data' })
      mockedRequest.done()
    }).catch((err) => {
      expect(err).to.equal(undefined)
    })
  })

  it('rejects when the request fails', function () {
    let mockedRequest = generateMockedRequest(this.event, 500)

    return this.amplitude.track(this.data)
      .then((res) => {
        throw new Error('should not resolve')
      }).catch((err) => {
        expect(err.status).to.eql(500)
        expect(err.message).to.eql('Internal Server Error')
        mockedRequest.done()
      })
  })

  it('can accept an array of event objects', function () {
    let mockedRequest = generateMockedRequest([this.event], 200)

    return this.amplitude.track([this.data]).then((res) => {
      expect(res).to.eql({ some: 'data' })
      mockedRequest.done()
    }).catch((err) => {
      expect(err).to.equal(undefined)
    })
  })
})
