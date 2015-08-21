import gulp from 'gulp';
import fs from 'fs';

const PKG = require('../package.json');
const README_LOCATION = __dirname + '/../README.md';

gulp.task('update:readme', () => {
  let readmeFile = fs.readFileSync(README_LOCATION, { encoding: 'utf8' });
  let readme = cleanReadme(readmeFile);

  let contributorText = getContributorText();

  readme += contributorText;

  fs.writeFileSync(README_LOCATION, readme);
});

function cleanReadme(file) {
  let lines = file.split('\n');
  let lastLine = lines.indexOf('------>');
  let readme = lines.slice(0, lastLine + 1).join('\n');

  return readme;
}

function getContributorText() {
  let text = '\n\n## Contributors\n\n';
  let contributors = PKG.contributors;

  for (var index in contributors) {
    let c = contributors[index];
    text += `+ [${c.name}](${c.url})\n`;
  }

  return text;
}
