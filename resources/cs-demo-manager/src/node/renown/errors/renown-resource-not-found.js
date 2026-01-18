import { ErrorCode } from 'csdm/common/error-code';
import { RenownApiError } from './renown-api-error';
export class RenownResourceNotFound extends RenownApiError {
    constructor() {
        super();
        this.code = ErrorCode.RenownApiResourceNotFound;
        this.message = 'Renown resource not found';
    }
}
//# sourceMappingURL=renown-resource-not-found.js.map