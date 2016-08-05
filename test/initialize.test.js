'use strict'

let Amplitude = require('../amplitude')

describe('initialization', () => {
  it('throws an error if no api token is passed', () => {
    expect(() => {
      let amplitude = new Amplitude()
    }).to.throw('No token provided')
  })

  it('is ininitalized with an api token', () => {
    let amplitude = new Amplitude('token')

    expect(amplitude.token).to.eql('token')
  })

  it('sets session_user_id when specified', () => {
    let amplitude = new Amplitude('token', { user_id: 'db_user_id' })

    expect(amplitude.session_user_id).to.eql('db_user_id')
  })

  it('sets session_device_id when specified', () => {
    let amplitude = new Amplitude('token', { device_id: 'db_device_id' })

    expect(amplitude.session_device_id).to.eql('db_device_id')
  })

  it('sets secretKey when specified', () => {
    let amplitude = new Amplitude('token', { secretKey: 'secret' })

    expect(amplitude.secretKey).to.eql('secret')
  })
})
