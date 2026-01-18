import { BaseError } from 'csdm/node/errors/base-error';
import { ErrorCode } from 'csdm/common/error-code';
export class SteamAccountNotFound extends BaseError {
    constructor() {
        super(ErrorCode.SteamAccountNotFound);
        this.message = 'Steam account not found';
    }
}
//# sourceMappingURL=steam-account-not-found.js.map