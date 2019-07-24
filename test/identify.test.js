'use strict'

const nock = require('nock')
const Amplitude = require('../amplitude')

function generateMockedRequest (identity, status) {
  const mockedRequest = nock('https://api.amplitude.com')
    .post('/identify')
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

    this.identity = {
      city: 'Brooklyn',
      paying: false,
      user_properties: {
        likes_chocolate: true
      },
      user_id: 'unique_user_id',
      device_id: 'unique_device_id'
    }
  })

  it('resolves when the request succeeds', function () {
    const mockedRequest = generateMockedRequest(this.identity, 200)

    return this.amplitude.identify(this.data).then((res) => {
      expect(res).to.eql({ some: 'data' })
      mockedRequest.done()
    }).catch((err) => {
      expect(err).to.equal(undefined)
    })
  })

  it('can override the user id set on initialization', function () {
    this.identity = {
      city: 'Brooklyn',
      paying: false,
      user_properties: {
        likes_chocolate: true
      },
      user_id: 'another_user_id',
      device_id: 'unique_device_id'
    }
    this.data = {
      city: 'Brooklyn',
      paying: false,
      user_properties: {
        likes_chocolate: true
      },
      user_id: 'another_user_id'
    }

    const mockedRequest = generateMockedRequest(this.identity, 200)

    return this.amplitude.identify(this.data).then((res) => {
      expect(res).to.eql({ some: 'data' })
      mockedRequest.done()
    }).catch((err) => {
      expect(err).to.equal(undefined)
    })
  })

  it('can override the device id set on initialization', function () {
    this.identity = {
      city: 'Brooklyn',
      paying: false,
      user_properties: {
        likes_chocolate: true
      },
      device_id: 'another_device_id',
      user_id: 'unique_user_id'
    }
    this.data = {
      city: 'Brooklyn',
      paying: false,
      user_properties: {
        likes_chocolate: true
      },
      device_id: 'another_device_id'
    }

    const mockedRequest = generateMockedRequest(this.identity, 200)

    return this.amplitude.identify(this.data).then((res) => {
      expect(res).to.eql({ some: 'data' })
      mockedRequest.done()
    }).catch((err) => {
      expect(err).to.equal(undefined)
    })
  })

  it('rejects when the request fails', function () {
    const mockedRequest = generateMockedRequest(this.identity, 500)

    return this.amplitude.identify(this.data)
      .then((res) => {
        throw new Error('should not resolve')
      }).catch((err) => {
        expect(err.status).to.eql(500)
        expect(err.message).to.eql('Internal Server Error')
        mockedRequest.done()
      })
  })

  it('can accept an array of identity objects', function () {
    this.identity = [{
      city: 'Brooklyn',
      paying: false,
      user_properties: {
        likes_chocolate: true
      },
      user_id: 'unique_user_id',
      device_id: 'unique_device_id'
    },
    {
      city: 'Brooklyn',
      paying: false,
      user_properties: {
        likes_chocolate: true
      },
      user_id: 'unique_user_id',
      device_id: 'unique_device_id'
    }]

    this.data = [{
      city: 'Brooklyn',
      paying: false,
      user_properties: {
        likes_chocolate: true
      }
    },
    {
      city: 'Brooklyn',
      paying: false,
      user_properties: {
        likes_chocolate: true
      }
    }]

    const mockedRequest = generateMockedRequest(this.identity, 200)

    return this.amplitude.identify(this.data).then((res) => {
      expect(res).to.eql({ some: 'data' })
      mockedRequest.done()
    }).catch((err) => {
      expect(err).to.equal(undefined)
    })
  })
})
