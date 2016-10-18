'use strict'

const nock = require('nock')
const Amplitude = require('../amplitude')

function generateMockedRequest (identity, status) {
  let mockedRequest = nock('https://api.amplitude.com')
    .defaultReplyHeaders({ 'Content-Type': 'application/json' })
    .post('/identify', {
      api_key: 'token',
      identification: identity
    })
    .reply(status, { some: 'data' })

  return mockedRequest
}

describe('identify', function () {
  beforeEach(function () {
    this.amplitude = new Amplitude('token', {
      user_id: 'unique_user_id',
      device_id: 'unique_device_id'
    })

    this.data = {
      city: 'Brooklyn',
      paying: false,
      user_properties: {
        likes_chocolate: true
      }
    }

    this.id = {
      user_id: 'unique_user_id',
      device_id: 'unique_device_id',
      city: 'Brooklyn',
      paying: false,
      user_properties: {
        likes_chocolate: true
      }
    }
  })

  it('resolves when the request succeeds', function () {
    let mockedRequest = generateMockedRequest(this.id, 200)

    return this.amplitude.identify(this.data).then((res) => {
      expect(res).to.eql({ some: 'data' })
      mockedRequest.done()
    }).catch((err) => {
      expect(err).to.not.exist
    })
  })

  it('can override the user id set on initialization', function () {
    this.id.device_id = 'unique_device_id';
    this.id.user_id = 'another_user_id';
    this.data.user_id = 'another_user_id';

    let mockedRequest = generateMockedRequest(this.id, 200)

    return this.amplitude.identify(this.data).then((res) => {
      expect(res).to.eql({ some: 'data' })
      mockedRequest.done()
    }).catch((err) => {
      expect(err).to.not.exist
    })
  })

  it('can override the device id set on initialization', function () {
    this.id.device_id = 'another_device_id';
    this.id.user_id = 'unique_user_id';
    this.data.device_id = 'another_device_id'

    let mockedRequest = generateMockedRequest(this.id, 200)

    return this.amplitude.identify(this.data).then((res) => {
      expect(res).to.eql({ some: 'data' })
      mockedRequest.done()
    }).catch((err) => {
      expect(err).to.not.exist
    })
  })

  it('rejects when the request fails', function () {
    let mockedRequest = generateMockedRequest(this.id, 500)

    return this.amplitude.identify(this.data)
      .then((res) => {
        throw new Error('should not resolve')
      }).catch((err) => {
        expect(err.status).to.eql(500)
        expect(err.message).to.eql('Internal Server Error')
        mockedRequest.done()
      })
  })
})
