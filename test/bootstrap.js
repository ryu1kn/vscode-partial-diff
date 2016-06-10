
const chai = require('chai');
chai.use(require('sinon-chai'));

global.expect = chai.expect;
global.sinon = require('sinon');
global.throwErrorIfCalled = () => {
    throw new Error("Shouldn't have been called");
};
