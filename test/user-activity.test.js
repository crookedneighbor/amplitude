'use strict'

const nock = require('nock')
const Amplitude = require('../amplitude')

function generateMockedRequest (userSearchId, matches, status) {
  let query = { user: userSearchId }

  if (typeof userSearchId === 'object') {
    query = userSearchId
  }
  return nock('https://amplitude.com')
    .get('/api/2/useractivity')
    .query(query)
    .basicAuth({
      user: 'token',
      pass: 'key'
    })
    .reply(status, matches)
}

describe('userActivity', function () {
  beforeEach(function () {
    this.amplitude = new Amplitude('token', {
      secretKey: 'key'
    })
    this.userSearchIds = {
      // this is an incomplete response
      found: {
        'userData': {
          'num_sessions': 3,
          'purchases': 0,
          'revenue': 0,
          'start_version': '',
          'merged_amplitude_ids': [
            22222222222
          ],
          'num_events': 18,
          'ip_address': '1.1.1.1',
          'last_used': '2016-11-09',
          'platform': 'Web',
          'device_type': 'Mac',
          'device': 'Mac',
          'library': 'amplitude-js/3.3.2',
          'first_used': '2016-11-09',
          'properties': {
            'custom_user_prop': 'something'
          },
          'canonical_amplitude_id': 11111111,
          'dma': 'Austin, TX',
          'paying': '',
          'city': 'Austin',
          'user_id': 'blah',
          'language': 'English',
          'last_location': null,
          'country': 'United States',
          'region': 'Texas',
          'usage_time': 1273334,
          'version': '',
          'last_device_id': '11111111111-1111-1111-1111-1111111111',
          'carrier': '',
          'device_ids': [
            '11111111111-1111-1111-1111-1111111111',
            '21111111111-1111-1111-1111-1111111111'
          ],
          'os': 'Chrome 54'
        },
        'events': [
          {
            'event_type': 'some_event',
            'app': 123456,
            'library': 'amplitude-js/3.3.2',
            'device_type': 'Mac',
            'device_carrier': null,
            'event_properties': {
              'some': 'thing'
            },
            'user_properties': {
              'custom_user_prop': 'something'
            }
          }
        ]
      },
      not_found: {
        'userData': {
          'num_sessions': 0,
          'purchases': 0,
          'revenue': 0,
          'merged_amplitude_ids': [],
          'num_events': 0,
          'canonical_amplitude_id': 1,
          'user_id': null,
          'last_location': null,
          'usage_time': 0,
          'last_device_id': null,
          'device_ids': []
        },
        'events': []
      }
    }
  })

  it('throws an error if secret key is missing', function () {
    delete this.amplitude.secretKey

    expect(() => {
      this.amplitude.userActivity('anything')
    }).to.throw('secretKey must be set to use the userActivity method')
  })

  it('throws an error if nothing passed', function () {
    expect(() => {
      this.amplitude.userActivity()
    }).to.throw('Amplitude ID must be passed')
  })

  it('resolves user data and list of events when passed an existing Amplitude ID', function () {
    let amplitudeId = 11111111
    let mockedRequest = generateMockedRequest(amplitudeId, this.userSearchIds.found, 200)

    return this.amplitude.userActivity(amplitudeId).then((res) => {
      expect(res.type).to.eql(this.userSearchIds.found_by_user_props)
      mockedRequest.done()
    }).catch((err) => {
      expect(err).to.equal(undefined)
    })
  })

  it('should accept `limit` and `offset` as query params ', function () {
    let search = 'cant-find-me'
    let mockedRequest = generateMockedRequest({ user: search, limit: 0 }, this.userSearchIds.found, 200)

    return this.amplitude.userActivity(search, { limit: 0 }).then((res) => {
      expect(res).to.eql(this.userSearchIds.found)
      mockedRequest.done()
    }).catch((err) => {
      expect(err).to.equal(undefined)
    })
  })

  it('resolves an empty userData object if the id cannot be found', function () {
    let search = 'cant-find-me'
    let mockedRequest = generateMockedRequest(search, this.userSearchIds.not_found, 200)

    return this.amplitude.userActivity(search).then((res) => {
      expect(res).to.eql(this.userSearchIds.not_found)
      mockedRequest.done()
    }).catch((err) => {
      expect(err).to.equal(undefined)
    })
  })

  it('rejects with error when unsuccesful', function () {
    let search = 'cant-find-me'
    let mockedRequest = generateMockedRequest(search, this.userSearchIds.found, 403)

    return this.amplitude.userActivity(search).then((res) => {
      throw new Error('Should not have resolved')
    }).catch((err) => {
      expect(err.status).to.eql(403)
      expect(err.message).to.eql('Forbidden')
      mockedRequest.done()
    })
  })
})
