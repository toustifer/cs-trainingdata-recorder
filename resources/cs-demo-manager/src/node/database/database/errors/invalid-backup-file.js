import { ErrorCode } from 'csdm/common/error-code';
import { BaseError } from 'csdm/node/errors/base-error';
export class InvalidBackupFile extends BaseError {
    constructor() {
        super(ErrorCode.InvalidBackupFile);
        this.message = 'Invalid backup file';
    }
}
//# sourceMappingURL=invalid-backup-file.js.map