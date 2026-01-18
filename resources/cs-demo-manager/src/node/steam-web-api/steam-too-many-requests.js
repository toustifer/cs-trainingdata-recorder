import { ErrorCode } from 'csdm/common/error-code';
import { SteamApiError } from './steamapi-error';
export class SteamTooMayRequests extends SteamApiError {
    constructor() {
        super();
        this.code = ErrorCode.SteamApiTooManyRequests;
        this.message = 'Steam API returned a 429 status code';
    }
}
//# sourceMappingURL=steam-too-many-requests.js.map