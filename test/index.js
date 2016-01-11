var Mocha = require('mocha');
var mocha = new Mocha();
mocha.addFile(`${__dirname}/run.js`);
mocha.run(function(failures){
  process.on('exit', function () {
    process.exit(failures);
  });
});
