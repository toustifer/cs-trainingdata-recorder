import { BaseError } from 'csdm/node/errors/base-error';
import { ErrorCode } from 'csdm/common/error-code';
export class SteamAccountAlreadyIgnored extends BaseError {
    constructor() {
        super(ErrorCode.SteamAccountAlreadyIgnored);
        this.message = 'Steam account is already ignored';
    }
}
//# sourceMappingURL=steam-account-already-ignored.js.map