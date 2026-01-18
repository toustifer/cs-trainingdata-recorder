import { BaseError } from 'csdm/node/errors/base-error';
import { ErrorCode } from 'csdm/common/error-code';
export class FaceitApiError extends BaseError {
    constructor(httpStatus) {
        super(ErrorCode.FaceItApiError);
        if (httpStatus !== undefined) {
            this.message = `FACEIT API error with HTTP status ${httpStatus}`;
        }
        else {
            this.message = 'FACEIT API error';
        }
    }
}
//# sourceMappingURL=faceit-api-error.js.map