import { ErrorCode } from 'csdm/common/error-code';
import { RenownApiError } from './renown-api-error';
export class RenownInvalidRequest extends RenownApiError {
    constructor() {
        super();
        this.code = ErrorCode.RenownInvalidRequest;
        this.message = 'Renown API returned a 400';
    }
}
//# sourceMappingURL=renown-invalid-request.js.map