import { runDemoAnalyzer } from 'csdm/node/demo-analyzer/run-demo-analyzer';
import { assertDemoExists } from 'csdm/node/counter-strike/launcher/assert-demo-exists';
export async function analyzeDemo({ outputFolderPath, demoPath, source, analyzePositions, onStdout, onStderr, }) {
    await assertDemoExists(demoPath);
    await runDemoAnalyzer({
        outputFolderPath,
        demoPath,
        source,
        analyzePositions,
        onStart: (command) => {
            logger.log('starting demo analyzer with command', command);
        },
        onStdout: onStdout ?? logger.log,
        onStderr: onStderr ?? logger.error,
        onEnd: (code) => {
            logger.log('demo analyzer exited with code', code);
        },
    });
}
//# sourceMappingURL=analyze-demo.js.map