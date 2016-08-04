var chai = require('chai')
var sinonChai = require('sinon-chai')
var chaiAsPromised = require('chai-as-promised')
var sinon = require('sinon')

global.expect = require('chai').expect

chai.use(expect)
chai.use(chaiAsPromised)
chai.use(sinonChai)

global.sandbox = sinon.sandbox.create()
