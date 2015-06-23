class Amplitude {
  constructor(token) {
    this.token = token;

    _checkForToken(token);
  }
}

function _checkForToken(token) {
  if(!token) { throw 'No token provided'; }
}

exports.Amplitude = Amplitude;
