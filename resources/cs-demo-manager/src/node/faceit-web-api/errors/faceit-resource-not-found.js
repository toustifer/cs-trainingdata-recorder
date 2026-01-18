import { ErrorCode } from 'csdm/common/error-code';
import { FaceitApiError } from './faceit-api-error';
export class FaceitResourceNotFound extends FaceitApiError {
    constructor() {
        super();
        this.code = ErrorCode.FaceItApiResourceNotFound;
        this.message = 'FACEIT resource not found';
    }
}
//# sourceMappingURL=faceit-resource-not-found.js.map