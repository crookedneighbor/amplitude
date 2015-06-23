import { Amplitude } from '../lib/amplitude';

describe('initialization', () => {
  it('is ininitalized with an api token', () => {
    let amplitude = new Amplitude('token');

    expect(amplitude.token).to.eql('token');
  });

  it('throws an error if initialized without a token', () => {
    sinon.spy(Amplitude);

    expect(() => {
      let amplitude = new Amplitude();
    }).to.throw(/No token provided/);
  });
});
