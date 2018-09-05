import VsTelemetryReporter from 'vscode-extension-telemetry';
import * as fs from 'fs';

export function createTelemetryReporter(packageJsonPath: string): VsTelemetryReporter {
    const packageInfo = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const extensionId = `${packageInfo.publisher}.${packageInfo.name}`;
    const extensionVersion = packageInfo.version;
    const key = packageInfo.telemetryKey;
    return new VsTelemetryReporter(extensionId, extensionVersion, key);
}
