const sinon = require('sinon')
const td = require('testdouble')
const chai = require('chai')
chai.use(require('sinon-chai'))

exports.expect = chai.expect
exports.sinon = sinon
exports.throwErrorIfCalled = () => {
  throw new Error("Shouldn't have been called")
}

// Usage: stubWithArgs([call1Arg1, ...], return1, [call2Arg1, ...], return2, ...)
exports.stubWithArgs = function (...args) {
  const stub = sinon.stub()
  for (let i = 0; i + 1 < args.length; i += 2) {
    stub.withArgs.apply(stub, args[i]).returns(args[i + 1])
  }
  return stub
}

exports.mockObject = td.object
exports.argCaptor = td.matchers.captor
exports.verify = td.verify
exports.when = td.when
exports.matchers = td.matchers
