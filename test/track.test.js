let nock = require('nock');
import Amplitude from '../src/amplitude';

describe('track', () => {

  let amplitude = new Amplitude('token', {
    user_id: 'unique_user_id',
    deviced_id: 'unqiue-device-id'
  });

  let api_url = 'https://api.amplitude.com';
  let stringified_url = '/httpapi?api_key=token&event=%7B%22event_type%22%3A%22event%22%2C%22user_id%22%3A%22unique_user_id%22%7D';

  beforeEach(() => {
    sandbox.stub(console, 'error');
  });

  context('succesful call', () => {

    beforeEach(() => {
      nock(api_url)
        .defaultReplyHeaders({ 'Content-Type': 'application/json' })
        .post(stringified_url)
        .reply(function () {
          return [200, JSON.stringify({ some: 'data' })];
        });
    });

    it('does not log error', (done) => {
      let data = { event_type: 'event' };

      amplitude.track(data, (err) => {
        expect(console.error).to.not.be.called;
        expect(err).to.be.a('null');
        done();
      });
    });

    it('passes response data', (done) => {
      let data = { event_type: 'event' };

      amplitude.track(data, (err, data) => {
        expect(data).to.include.keys('some');
        done();
      });
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

    it('logs error', (done) => {
      amplitude.track(data, (err, data) => {
        expect(console.error).to.be.calledOnce;
        expect(console.error).to.be.calledWith('There was a problem tracking "event" for "unique_user_id"; Error: Internal Server Error');
        done();
      });
    });

    it('passes error response data', (done) => {
      amplitude.track(data, (err, data) => {
        expect(data).to.include.keys('message');
        expect(data.message).to.equal('not successful');
        done();
      });
    });
  });
});
