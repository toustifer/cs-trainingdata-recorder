import { getErrorCodeFromError } from 'csdm/server/get-error-code-from-error';
import { connectDatabase } from 'csdm/node/database/connect-database';
export async function connectDatabaseHandler(databaseSettings) {
    try {
        await connectDatabase(databaseSettings);
    }
    catch (error) {
        logger.error('Error while connecting to the database');
        logger.error(error);
        const code = getErrorCodeFromError(error);
        let message = 'Unknown error';
        if (error instanceof Error) {
            message = error.message;
        }
        const payload = {
            code,
            message,
        };
        return payload;
    }
}
//# sourceMappingURL=connect-database-handler.js.map