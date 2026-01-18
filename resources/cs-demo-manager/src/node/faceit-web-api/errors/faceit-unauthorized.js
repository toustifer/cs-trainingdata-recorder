import { ErrorCode } from 'csdm/common/error-code';
import { FaceitApiError } from './faceit-api-error';
export class FaceitUnauthorized extends FaceitApiError {
    constructor() {
        super();
        this.code = ErrorCode.FaceItApiUnauthorized;
        this.message = 'FACEIT API returned a 401';
    }
}
//# sourceMappingURL=faceit-unauthorized.js.map