let nock = require('nock');
import Amplitude from '../src/amplitude';

describe('track', () => {

  let amplitude = new Amplitude('token', {
    user_id: 'unique_user_id',
    deviced_id: 'unqiue-device-id'
  });

  let api_url = 'https://api.amplitude.com';
  let stringified_url = '/httpapi?api_key=token&event=%7B%22event_type%22%3A%22event%22%2C%22user_id%22%3A%22unique_user_id%22%7D';

  context('succesful call', () => {

    beforeEach(() => {
      nock(api_url)
        .defaultReplyHeaders({ 'Content-Type': 'application/json' })
        .post(stringified_url)
        .reply(function () {
          return [200, JSON.stringify({ some: 'data' })];
        });
    });

    it('passes data', () => {
      let data = { event_type: 'event' };

      expect(amplitude.track(data))
        .to.eventually.eql({ some: 'data' });
    });

    it('does not pass error', () => {
      let data = { event_type: 'event' };

      expect(amplitude.track(data)).to.not.be.rejected;
    });
  });

  context('unsucesful call', () => {
    let data = { event_type: 'event' };

    beforeEach(() => {
      nock(api_url)
        .defaultReplyHeaders({ 'Content-Type': 'application/json' })
        .post(stringified_url)
        .reply(function () {
          return [500, { message: 'not successful' }];
        })
    });

    it('does not resolve', () => {
      expect(amplitude.track(data)).to.not.be.resolved;
    });

    it('passes error', () => {
      expect(amplitude.track(data)).to.be.rejected;
      expect(amplitude.track(data)).to.be.rejectedWith({
        message: 'not successful'
      });
    });
  });
});
