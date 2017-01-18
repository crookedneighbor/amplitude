'use strict'

const Amplitude = require('../amplitude')
const nock = require('nock')

function generateMockedRequest (query, status) {
  let mockedRequest = nock('https://amplitude.com')
    .defaultReplyHeaders({ 'Content-Type': 'application/zip' })
    .get('/api/2/export')
    .query(query)
    .basicAuth({
      user: 'token',
      pass: 'key'
    })
    .reply(status)

  return mockedRequest
}

describe('export', function () {
  beforeEach(function () {
    this.amplitude = new Amplitude('token', {
      secretKey: 'key'
    })
    this.options = {
      start: '20160523T20',
      end: '20160525T20'
    }
  })

  it('throws an error if secret key is missing', function () {
    delete this.amplitude.secretKey

    expect(() => {
      this.amplitude.export(this.options)
    }).to.throw('secretKey must be set to use the export method')
  })

  it('throws an error if start param is missing', function () {
    delete this.options.start

    expect(() => {
      this.amplitude.export(this.options)
    }).to.throw('`start` and `end` are required options')
  })

  it('throws an error if end param is missing', function () {
    delete this.options.end

    expect(() => {
      this.amplitude.export(this.options)
    }).to.throw('`start` and `end` are required options')
  })

  it('resolves a zip when succesful', function () {
    let mockedRequest = generateMockedRequest(this.options, 200)

    return this.amplitude.export(this.options).then((data) => {
      expect(data.res.headers['content-type']).to.eql('application/zip')
      mockedRequest.done()
    }).catch((err) => {
      expect(err).to.not.exist
    })
  })

  it('rejects with error when unsuccesful', function () {
    let mockedRequest = generateMockedRequest(this.options, 403)

    return this.amplitude.export(this.options).then((res) => {
      throw new Error('Should not have resolved')
    }).catch((err) => {
      expect(err.status).to.eql(403)
      expect(err.message).to.eql('Forbidden')
      mockedRequest.done()
    })
  })
})
