import BootstrapperFactory from './lib/bootstrapper-factory';
import {ExecutionContextLike} from './lib/types/vscode';
import {TelemetryReporterLocator} from './lib/telemetry-reporter';
import {join} from 'path';

const bootstrapperFactory = new BootstrapperFactory();
const reporterCreator = bootstrapperFactory.getVsTelemetryReporterCreator();
const packageJsonPath = join(__dirname, '..', 'package.json');

TelemetryReporterLocator.load(packageJsonPath, reporterCreator);
const telemetryReporter = TelemetryReporterLocator.getReporter();

exports.activate = (context: ExecutionContextLike) => {
    const bootstrapper = bootstrapperFactory.create();
    bootstrapper.initiate(context);

    context.subscriptions.push(telemetryReporter);
};

exports.deactivate = () => {
    telemetryReporter.dispose();
};
