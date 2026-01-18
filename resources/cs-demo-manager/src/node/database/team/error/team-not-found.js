import { BaseError } from 'csdm/node/errors/base-error';
import { ErrorCode } from 'csdm/common/error-code';
export class TeamNotFound extends BaseError {
    constructor() {
        super(ErrorCode.TeamNotFound);
        this.message = 'Team not found';
    }
}
//# sourceMappingURL=team-not-found.js.map