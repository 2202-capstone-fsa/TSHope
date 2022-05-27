const exportsFromFileB = require("./fileB"); // note the relative file path

// console.log(exportsFromFileB); {foo = 'hw' bar = 'gw'}

// exportsFromFileB(); // it retured as the finished state = 5

// require("./fileB");
// require("./fileB"); // only does it once

console.log(exportsFromFileB);

// When you require a module for the first time, the following occurs:
// Node executes the file being required and calculates the value of module.exports
// Node caches the result of module.exports
// Node returns the module.exports to the place where it was required
// Subsequent attempts to require the same module will return the cached module.exports. The file will not execute twice!
// When you require a built-in module or an installed node module, you omit any file path
// Ex. when we require a built-in node module like fs, we just say require('fs')
// Ex. when we require a node module that we install like chalk, we just say require('chalk') (not require('./node_modules/chalk') - Node knows to do this for us!)
// When you require one of your own modules, you must reference the path to the file
// Ex. you must say require('./fileA') - Node will not recognize require('fileA') (unless fileA happens to be a node module!).
