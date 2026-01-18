import path from 'node:path';
import { analyzeDemo } from '@akiver/cs-demo-analyzer';
import { getStaticFolderPath } from 'csdm/node/filesystem/get-static-folder-path';
import { isWindows } from 'csdm/node/os/is-windows';
import { CorruptedDemoError } from './corrupted-demo-error';
export async function runDemoAnalyzer(options) {
    const executablePath = path.join(getStaticFolderPath(), isWindows ? 'csda.exe' : 'csda');
    await analyzeDemo({
        ...options,
        executablePath,
        format: 'csdm',
        onStderr: (data) => {
            options.onStderr?.(data);
            if (data.includes('ErrUnexpectedEndOfDemo')) {
                throw new CorruptedDemoError();
            }
        },
    });
}
//# sourceMappingURL=run-demo-analyzer.js.map