'use strict'

const fs = require('fs')
const PKG = require('../package.json')
const README_LOCATION = __dirname + '/../README.md'

function cleanReadme(file) {
  let lines = file.split('\n')
  let lastLine = lines.indexOf('------>')
  let readme = lines.slice(0, lastLine + 1).join('\n')

  return readme
}

function getContributorText() {
  let text = '\n\n## Contributors\n\n'
  let contributors = Object.keys(PKG.contributors).map(con => PKG.contributors[con])

  contributors.forEach((contributor) => {
    if (contributor.url) {
      text += `+ [${contributor.name}](${contributor.url})\n`
    } else {
      text += `+ ${contributor.name}\n`
    }
  });

  return text
}

let readmeFile = fs.readFileSync(README_LOCATION, { encoding: 'utf8' })
let readme = cleanReadme(readmeFile)

let contributorText = getContributorText()

readme += contributorText

fs.writeFileSync(README_LOCATION, readme)

