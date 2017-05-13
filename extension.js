
const BootstrapperFactory = require('./lib/bootstrapper-factory');

exports.activate = context => {
    const bootstrapper = new BootstrapperFactory().create();
    bootstrapper.initiate(context);
};

exports.deactivate = () => {};
