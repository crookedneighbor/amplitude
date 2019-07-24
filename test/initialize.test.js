'use strict'

const Amplitude = require('../amplitude')

describe('initialization', () => {
  it('throws an error if no api token is passed', () => {
    expect(() => {
      let amplitude = new Amplitude() // eslint-disable-line
    }).to.throw('No token provided')
  })

  it('is ininitalized with an api token', () => {
    const amplitude = new Amplitude('token')

    expect(amplitude.token).to.eql('token')
  })

  it('sets userId when specified', () => {
    const amplitude = new Amplitude('token', { userId: 'db_user_id' })

    expect(amplitude.userId).to.eql('db_user_id')
  })

  it('can use user_id to set userId', () => {
    const amplitude = new Amplitude('token', { user_id: 'db_user_id' })

    expect(amplitude.userId).to.eql('db_user_id')
  })

  it('prefers userId over user_id to set userId', () => {
    const amplitude = new Amplitude('token', { userId: 'userId', user_id: 'user_id' })

    expect(amplitude.userId).to.eql('userId')
  })

  it('sets deviceId when specified', () => {
    const amplitude = new Amplitude('token', { deviceId: 'db_device_id' })

    expect(amplitude.deviceId).to.eql('db_device_id')
  })

  it('can use device_id to set deviceId', () => {
    const amplitude = new Amplitude('token', { device_id: 'db_device_id' })

    expect(amplitude.deviceId).to.eql('db_device_id')
  })

  it('prefers deviceId over device_id to set deviceId', () => {
    const amplitude = new Amplitude('token', { deviceId: 'deviceId', device_id: 'device_id' })

    expect(amplitude.deviceId).to.eql('deviceId')
  })

  it('sets secretKey when specified', () => {
    const amplitude = new Amplitude('token', { secretKey: 'secret' })

    expect(amplitude.secretKey).to.eql('secret')
  })

  it('sets sessionId when specified', () => {
    const amplitude = new Amplitude('token', { sessionId: 'db_session_id' })

    expect(amplitude.sessionId).to.eql('db_session_id')
  })

  it('can use session_id to set sessionId', () => {
    const amplitude = new Amplitude('token', { session_id: 'db_session_id' })

    expect(amplitude.sessionId).to.eql('db_session_id')
  })

  it('prefers sessionId over session_id to set sessionId', () => {
    const amplitude = new Amplitude('token', { sessionId: 'sessionId', session_id: 'session_id' })

    expect(amplitude.sessionId).to.eql('sessionId')
  })
})
