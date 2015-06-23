global.sinon     = require('sinon');
global.sinonChai = require('sinon-chai');
global.expect    = require('chai').expect;
global.chai      = require('chai');

chai.use(expect);
chai.use(sinonChai);

global.sandbox = sinon.sandbox.create();
