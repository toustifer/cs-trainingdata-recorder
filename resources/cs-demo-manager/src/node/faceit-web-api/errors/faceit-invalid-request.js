import { ErrorCode } from 'csdm/common/error-code';
import { FaceitApiError } from './faceit-api-error';
export class FaceitInvalidRequest extends FaceitApiError {
    constructor() {
        super();
        this.code = ErrorCode.FaceItApiInvalidRequest;
        this.message = 'FACEIT API returned a 400';
    }
}
//# sourceMappingURL=faceit-invalid-request.js.map