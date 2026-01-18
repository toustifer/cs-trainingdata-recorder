import {} from 'node:util';
import { getSettings } from 'csdm/node/settings/get-settings';
import { createDatabaseConnection } from 'csdm/node/database/database';
import { migrateDatabase } from 'csdm/node/database/migrations/migrate-database';
export class Command {
    args;
    commonArgs = {
        verbose: { type: 'boolean', short: 'v', default: false },
    };
    constructor(args) {
        this.args = args;
    }
    exit() {
        return process.exit(0);
    }
    exitWithFailure() {
        return process.exit(1);
    }
    parseArgs(args) {
        if (args.includes('--help')) {
            this.printHelp();
            this.exit();
        }
    }
    async initDatabaseConnection() {
        const settings = await getSettings();
        createDatabaseConnection(settings.database);
        await migrateDatabase();
    }
    isFlagArgument(arg) {
        return arg.startsWith('--');
    }
    formatFlagForHelp(flag) {
        return `[${flag}]`;
    }
    formatFlagsForHelp(flags) {
        return flags.map(this.formatFlagForHelp).join(' ');
    }
}
//# sourceMappingURL=command.js.map