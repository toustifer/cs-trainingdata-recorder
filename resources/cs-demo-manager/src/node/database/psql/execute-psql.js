import { exec } from 'node:child_process';
import { PsqlTimeout } from './errors/psql-timeout';
function removeDatabaseInformationFromMessage(message) {
    const regex = /postgresql:\/\/(.*?):(.*?)@(.*):(\d+)\/?(.*)/g;
    return message.replace(regex, 'postgresql://*****:*****@*****:****/$5');
}
export async function executePsql(command, options) {
    return new Promise((resolve, reject) => {
        exec(`psql ${command}`, {
            env: { ...process.env, PGCONNECT_TIMEOUT: '10' },
            timeout: options?.timeoutMs ?? 0,
        }, (error) => {
            if (error !== null) {
                const isTimeout = (error.code === null && error.signal === 'SIGTERM') ||
                    (error instanceof Error && error.message.includes('timeout'));
                error.message = removeDatabaseInformationFromMessage(error.message);
                if (isTimeout) {
                    return reject(new PsqlTimeout());
                }
                return reject(error);
            }
            resolve();
        });
    });
}
//# sourceMappingURL=execute-psql.js.map