import { ErrorCode } from 'csdm/common/error-code';
import { FaceitApiError } from './faceit-api-error';
export class FaceitForbiddenError extends FaceitApiError {
    constructor() {
        super();
        this.code = ErrorCode.FaceItApiForbidden;
        this.message = 'FACEIT API returned a 403';
    }
}
//# sourceMappingURL=faceit-forbidden-error.js.map