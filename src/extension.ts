import BootstrapperFactory from './lib/bootstrapper-factory';
import {ExecutionContextLike} from './lib/types/vscode';

const bootstrapperFactory = new BootstrapperFactory();
const telemetryReporter = bootstrapperFactory.getTelemetryReporter();

exports.activate = (context: ExecutionContextLike) => {
    const bootstrapper = bootstrapperFactory.create();
    bootstrapper.initiate(context);

    context.subscriptions.push(telemetryReporter);
};

exports.deactivate = () => {
    telemetryReporter.dispose();
};
