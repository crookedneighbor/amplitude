import { Amplitude } from '../lib/amplitude';

describe('initialization', () => {
  context('with api token', () => {
    it('is ininitalized', () => {
      let amplitude = new Amplitude('token');

      expect(amplitude.token).to.eql('token');
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
