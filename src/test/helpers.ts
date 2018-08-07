const td = require('testdouble');

exports.throwErrorIfCalled = () => {
  throw new Error("Shouldn't have been called");
};

exports.mockObject = td.object;
exports.argCaptor = td.matchers.captor;
exports.verify = td.verify;
exports.when = td.when;
exports.contains = td.matchers.contains;
exports.any = td.matchers.anything;
