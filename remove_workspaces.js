/**
 * Removes workspaces key from package.json to avoid issue with Yarn v1
 * See: https://github.com/wojtekmaj/enzyme-adapter-react-17/issues/26
 */
const fs = require('fs');

fs.copyFileSync('./package.json', './package.json.bak');

const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

const {
  workspaces,
  ...packageJsonWithoutWorkspaces
} = packageJson;

fs.writeFileSync('package.json', `${JSON.stringify(packageJsonWithoutWorkspaces, null, 2)}\n`);
