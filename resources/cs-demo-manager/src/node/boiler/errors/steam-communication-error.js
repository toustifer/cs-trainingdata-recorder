import { BaseError } from 'csdm/node/errors/base-error';
import { ErrorCode } from 'csdm/common/error-code';
export class SteamCommunicationError extends BaseError {
    constructor() {
        super(ErrorCode.BoilerCommunicationFailure);
        this.message = 'Error while communicating with the GC';
    }
}
//# sourceMappingURL=steam-communication-error.js.map