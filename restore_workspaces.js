/**
 * Restores original package.json file
 */
const fs = require('fs');

fs.copyFileSync('./package.json.bak', './package.json');

fs.unlinkSync('./package.json.bak');
