import { Amplitude } from '../lib/amplitude';

describe('initialization', () => {
  context('with api token', () => {
    it('is ininitalized', () => {
      let amplitude = new Amplitude('token');

      expect(amplitude.token).to.eql('token');
    });

    it('sets session_user_id to undefined when no id specified', () => {
      let amplitude = new Amplitude('token');

      expect(amplitude.session_user_id).to.eql(undefined);
    });

    it('sets session_device_id to undefined when no id specified', () => {
      let amplitude = new Amplitude('token');

      expect(amplitude.session_device_id).to.eql(undefined);
    });

    it('looks up and sets session_user_id', () => {
      let amplitude = new Amplitude('token', { user_id: 'db_user_id' });

      expect(amplitude.session_user_id).to.eql('db_user_id');
    });

    it('looks up and sets session_device_id', () => {
      let amplitude = new Amplitude('token', { device_id: 'db_device_id' });

      expect(amplitude.session_device_id).to.eql('db_device_id');
    });
  });

  context('without api token', () => {
    it('throws an error', () => {
      sinon.spy(Amplitude);

      expect(() => {
        let amplitude = new Amplitude();
      }).to.throw(/No token provided/);
    });
  });
});
