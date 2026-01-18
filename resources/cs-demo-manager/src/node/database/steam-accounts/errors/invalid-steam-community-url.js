import { BaseError } from 'csdm/node/errors/base-error';
import { ErrorCode } from 'csdm/common/error-code';
export class InvalidSteamCommunityUrl extends BaseError {
    constructor() {
        super(ErrorCode.InvalidSteamCommunityUrl);
        this.message = 'Invalid Steam community URL';
    }
}
//# sourceMappingURL=invalid-steam-community-url.js.map