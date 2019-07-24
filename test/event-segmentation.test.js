'use strict'

const Amplitude = require('../amplitude')
const nock = require('nock')

function generateMockedRequest (query, response, status) {
  query.e = JSON.stringify(query.e)

  return nock('https://amplitude.com')
    .get('/api/2/events/segmentation')
    .query(query)
    .basicAuth({
      user: 'token',
      pass: 'key'
    })
    .reply(status, response)
}

describe('eventSegmentation', function () {
  beforeEach(function () {
    this.amplitude = new Amplitude('token', {
      secretKey: 'key'
    })
    this.data = {
      e: {
        event_type: 'mock_event'
      },
      start: '20160523T20',
      end: '20160525T20'
    }
    this.response = {
      series: [[2, 25, 3]],
      seriesLabels: [0],
      xValues: [
        '2017-01-15',
        '2017-01-16',
        '2017-01-17'
      ]
    }
  })

  it('throws an error if secret key is missing', function () {
    delete this.amplitude.secretKey

    expect(() => {
      this.amplitude.eventSegmentation(this.data)
    }).to.throw('secretKey must be set to use the eventSegmentation method')
  })

  it('throws an error if no data is passed in', function () {
    expect(() => {
      this.amplitude.eventSegmentation()
    }).to.throw('`e`, `start` and `end` are required data properties')
  })

  it('throws an error if e param is missing', function () {
    delete this.data.e

    expect(() => {
      this.amplitude.eventSegmentation(this.data)
    }).to.throw('`e`, `start` and `end` are required data properties')
  })

  it('throws an error if start param is missing', function () {
    delete this.data.start

    expect(() => {
      this.amplitude.eventSegmentation(this.data)
    }).to.throw('`e`, `start` and `end` are required data properties')
  })

  it('throws an error if end param is missing', function () {
    delete this.data.end

    expect(() => {
      this.amplitude.eventSegmentation(this.data)
    }).to.throw('`e`, `start` and `end` are required data properties')
  })

  it('rejects with error 400 when segmentation event does not exist', function () {
    this.data.e.event_type = 'event_no_exist'
    const mockedRequest = generateMockedRequest(this.data, null, 400)

    return this.amplitude.eventSegmentation(this.data).then((res) => {
      throw new Error('Should not have resolved')
    }).catch((err) => {
      expect(err.status).to.eql(400)
      mockedRequest.done()
    })
  })

  it('resolves with series and xValues if the segmentation event is found', function () {
    const mockedRequest = generateMockedRequest(this.data, this.response, 200)

    return this.amplitude.eventSegmentation(this.data).then((res) => {
      expect(res).to.eql(this.response)
      mockedRequest.done()
    }).catch((err) => {
      expect(err).to.equal(undefined)
    })
  })
})
