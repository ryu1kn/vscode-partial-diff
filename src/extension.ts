import BootstrapperFactory from './lib/bootstrapper-factory';
import {ExecutionContextLike} from './lib/types/vscode';

exports.activate = (context: ExecutionContextLike) => {
    const bootstrapper = new BootstrapperFactory().create();
    bootstrapper.initiate(context);
};

exports.deactivate = () => {
};
