'use strict'

const sinon = require('sinon')
const nock = require('nock')
const Amplitude = require('../amplitude')

function generateMockedRequest(userSearchId, matches, status) {
  return nock('https://amplitude.com')
    .defaultReplyHeaders({'Content-Type': 'application/json'})
    .get('/api/2/usersearch')
    .query({
      user: userSearchId
    })
    .basicAuth({
      user: 'token',
      pass: 'key'
    })
    .reply(status, matches)
}

describe('userSearch', function () {

  beforeEach(function () {
    this.amplitude = new Amplitude('token', {
      secretKey: 'key'
    })

    this.userActivityStub = sinon.stub(this.amplitude, 'userActivity')

    this.userSearchIds = {
      found_by_amplitude_id: {
        'matches': [
          {
            'user_id': 'user_id_1',
            'amplitude_id': 111111111
          }
        ],
        'type': 'match_amplitude_id'
      },
      found_by_user_props: {
        'matches': [
          {
            'user_id': 'user_id_2',
            'amplitude_id': 22222222
          }
        ],
        'type': 'match_user_props'
      },
      found_by_user_or_device_id: {
        'matches': [
          {
            'user_id': 'user_id_3',
            'amplitude_id': 33333333
          }
        ],
        'type': 'match_user_or_device_id'
      },
      not_found: {
        'matches': [],
        'type': 'nomatch'
      }
    }
  })

  it('throws an error if secret key is missing', function () {
    delete this.amplitude.secretKey

    expect(() => {
      this.amplitude.userSearch('anything')
    }).to.throw('secretKey must be set to use the userSearch method')
  });

  it('throws an error if nothing passed', function () {
    expect(() => {
      this.amplitude.userSearch()
    }).to.throw('value to search for must be passed')
  });

  it('resolves matches found by an amplitude_id', function () {
    let search = '111111111'
    let mockedRequest = generateMockedRequest(search, this.userSearchIds.found_by_amplitude_id, 200)

    return this.amplitude.userSearch(search).then((res) => {
      expect(res.matches).to.be.a('array')
      expect(res.matches.length).to.eql(1)
      expect(res.type).to.eql('match_amplitude_id')
      expect(this.userActivityStub.calledOnce).to.be.false
      mockedRequest.done()
    }).catch((err) => {
      expect(err).to.not.exist
    })
  })

  it('resolves matches found by a user property', function () {
    let search = 'user_id_2'
    let mockedRequest = generateMockedRequest(search, this.userSearchIds.found_by_user_props, 200)

    return this.amplitude.userSearch(search).then((res) => {
      expect(res.matches).to.be.a('array')
      expect(res.matches.length).to.eql(1)
      expect(res.type).to.eql('match_user_props')
      mockedRequest.done()
    }).catch((err) => {
      expect(err).to.not.exist
    })
  })

  it('resolves matches found by a device or user id', function () {
    let search = 'user_id_3'
    let mockedRequest = generateMockedRequest(search, this.userSearchIds.found_by_user_or_device_id, 200)

    return this.amplitude.userSearch(search).then((res) => {
      expect(res.matches).to.be.a('array')
      expect(res.matches.length).to.eql(1)
      expect(res.type).to.eql('match_user_or_device_id')
      mockedRequest.done()
    }).catch((err) => {
      expect(err).to.not.exist
    })
  })

  it('resolves the first found match `userActivity`', function () {
    let search = 'user_id_3'
    let mockedRequest = generateMockedRequest(search, this.userSearchIds.found_by_user_or_device_id, 200)

    this.userActivityStub.withArgs(this.userSearchIds.found_by_user_or_device_id.matches[0].amplitude_id).onFirstCall().returns(Promise.resolve({userData: {}, events: []}))

    return this.amplitude.userSearch(search, {withUserActivity: true}).then((res) => {
      expect(res.userData).to.be.a('object')
      expect(res.events).to.be.a('array')
      mockedRequest.done()
    }).catch((err) => {
      expect(err).to.not.exist
    })
  })

  it('resolves an empty userData object if there are no matches from `userActivity`', function () {
    let ampId = 1234567
    let mockedRequest = generateMockedRequest(ampId, this.userSearchIds.not_found, 200)

    this.userActivityStub.withArgs(ampId).onFirstCall().returns(Promise.resolve({userData: {}, events: []}))

    return this.amplitude.userSearch(ampId, {withUserActivity: true}).then((res) => {
      expect(res.userData).to.be.a('object')
      expect(res.events).to.be.a('array')
      mockedRequest.done()
    }).catch((err) => {
      expect(err).to.not.exist
    })
  })

  it('resolves zero matches when none found', function () {
    let search = 'cant-find-me'
    let mockedRequest = generateMockedRequest(search, this.userSearchIds.not_found, 200)

    return this.amplitude.userSearch(search).then((res) => {
      expect(res.matches).to.be.a('array')
      expect(res.matches.length).to.eql(0)
      expect(res.type).to.eql('nomatch')
      mockedRequest.done()
    }).catch((err) => {
      expect(err).to.not.exist
    })
  })

  it('rejects with error when unsuccesful', function () {
    let search = 'cant-find-me'
    let mockedRequest = generateMockedRequest(search, this.userSearchIds.found_by_amplitude_id, 403)

    return this.amplitude.userSearch(search).then((res) => {
      throw new Error('Should not have resolved')
    }).catch((err) => {
      expect(err.status).to.eql(403);
      expect(err.message).to.eql('Forbidden');
      mockedRequest.done()
    });
  })
})
