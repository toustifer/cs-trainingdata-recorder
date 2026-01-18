import { BaseError } from 'csdm/node/errors/base-error';
import { ErrorCode } from 'csdm/common/error-code';
export class PsqlNotFound extends BaseError {
    constructor() {
        super(ErrorCode.PsqlNotFound);
        this.message = 'PSQL binary not found';
    }
}
//# sourceMappingURL=psql-error.js.map