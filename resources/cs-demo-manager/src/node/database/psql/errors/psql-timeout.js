import { BaseError } from 'csdm/node/errors/base-error';
import { ErrorCode } from 'csdm/common/error-code';
export class PsqlTimeout extends BaseError {
    constructor() {
        super(ErrorCode.PsqlTimeout);
        this.message = 'PSQL timeout';
    }
}
//# sourceMappingURL=psql-timeout.js.map