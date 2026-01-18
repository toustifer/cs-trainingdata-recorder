import { BaseError } from 'csdm/node/errors/base-error';
import { ErrorCode } from 'csdm/common/error-code';
export class SteamAccountNameTooLong extends BaseError {
    constructor() {
        super(ErrorCode.SteamAccountNameTooLong);
        this.message = 'Steam account name too long';
    }
}
//# sourceMappingURL=steam-account-name-too-long.js.map