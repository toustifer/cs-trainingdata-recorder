import { BaseError } from 'csdm/node/errors/base-error';
import { ErrorCode } from 'csdm/common/error-code';
export class DuplicateTeamNameError extends BaseError {
    constructor(teamName) {
        super(ErrorCode.DuplicateTeamName);
        this.message = `Team names must be different (got: ${teamName})`;
    }
}
//# sourceMappingURL=duplicate-team-name-error.js.map