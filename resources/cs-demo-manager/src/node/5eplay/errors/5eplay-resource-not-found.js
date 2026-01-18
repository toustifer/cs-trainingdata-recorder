import { ErrorCode } from 'csdm/common/error-code';
import { FiveEPlayApiError } from './5eplay-api-error';
export class FiveEPlayResourceNotFound extends FiveEPlayApiError {
    constructor() {
        super();
        this.code = ErrorCode.FiveEPlayApiResourceNotFound;
        this.message = '5EPlay resource not found';
    }
}
//# sourceMappingURL=5eplay-resource-not-found.js.map