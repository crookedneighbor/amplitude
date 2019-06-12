'use strict'

let sinon = require('sinon')
let sinonChai = require('sinon-chai')
let chai = require('chai')

chai.use(sinonChai)

global.expect = chai.expect

beforeEach(function () {
  this.sandbox = sinon.createSandbox();
});
