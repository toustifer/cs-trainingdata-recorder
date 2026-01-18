import { BaseError } from 'csdm/node/errors/base-error';
import { ErrorCode } from 'csdm/common/error-code';
export class DatabaseSchemaVersionMismatch extends BaseError {
    constructor(databaseSchemaVersion, appSchemaVersion) {
        super(ErrorCode.DatabaseSchemaVersionMismatch);
        this.message = `Database schema version mismatch. Database schema version is ${databaseSchemaVersion}, app schema version is ${appSchemaVersion}.`;
    }
}
//# sourceMappingURL=database-schema-version-mismatch-error.js.map