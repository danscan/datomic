require('babel/register')({
  optional: ['runtime', 'es7.asyncFunctions']
});

var chai = require('chai');
chai.should();

process.on('unhandledRejection', function handleError(error) {
  console.error('Unhandled Promise Rejection:');
  console.error(error && error.stack || error);
});
