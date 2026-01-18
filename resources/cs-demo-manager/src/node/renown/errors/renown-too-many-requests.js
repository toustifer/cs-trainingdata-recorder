import { ErrorCode } from 'csdm/common/error-code';
import { RenownApiError } from './renown-api-error';
export class RenownTooManyRequests extends RenownApiError {
    constructor() {
        super();
        this.code = ErrorCode.RenownTooManyRequests;
        this.message = 'Renown API returned a 429 status code';
    }
}
//# sourceMappingURL=renown-too-many-requests.js.map