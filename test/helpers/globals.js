global.sinon     = require('sinon');
var sinonChai = require('sinon-chai');
var chaiAsPromised = require("chai-as-promised");
global.expect    = require('chai').expect;
global.chai      = require('chai');

chai.use(expect);
chai.use(chaiAsPromised);
chai.use(sinonChai);

global.sandbox = sinon.sandbox.create();
