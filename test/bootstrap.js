const chai = require('chai')
chai.use(require('sinon-chai'))

global.expect = chai.expect
global.sinon = require('sinon')
global.throwErrorIfCalled = () => {
  throw new Error("Shouldn't have been called")
}

// Usage: stubWithArgs([call1Arg1, ...], return1, [call2Arg1, ...], return2, ...)
global.stubWithArgs = function (...args) {
  const stub = sinon.stub()
  for (let i = 0; i + 1 < args.length; i += 2) {
    stub.withArgs.apply(stub, args[i]).returns(args[i + 1])
  }
  return stub
}
