'use strict'

const parseEcmascriptVersion = require('ecmascript-version-detector').parse
const glob = require('glob').sync
const fs = require('fs')

const files = glob('*.js')

describe('ES5 Compatibility', function () {
  beforeEach(function () {
    this.slow(8000)
    this.timeout(8000)
  })

  files.forEach((file) => {
    it(`${file} is compatible with ES5`, function (done) {
      fs.readFile(file, 'utf8', (err, data) => {
        if (err) {
          done(err)
          return
        }

        let errors = []

        parseEcmascriptVersion(data).forEach((expression) => {
          if (expression.selector === "//Program[@sourceType=='module']") {
            return
          }

          let expressionVersion = parseInt(expression.version, 10)

          try {
            expect(expressionVersion).to.be.at.most(5)
          } catch (err) {
            let node = expression.node
            let lineNumber = node.loc.start.line

            errors.push(`Found ES${expressionVersion} code (${node.type}) in ${file}:${lineNumber}`)
          }
        })

        let error = errors.join('\n')

        if (error) {
          error = new Error('\n' + error)
        }
        done(error)
      })
    })
  })
})
