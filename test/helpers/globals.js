'use strict'

let sinonChai = require('sinon-chai')
let chai = require('chai')

chai.use(sinonChai)

global.expect = chai.expect
global.sinon = require('sinon')
