import { BaseError } from 'csdm/node/errors/base-error';
import { ErrorCode } from 'csdm/common/error-code';
export class CounterStrikeNotRunning extends BaseError {
    constructor() {
        super(ErrorCode.CounterStrikeNotRunning);
        this.message = 'CS is not running';
    }
}
//# sourceMappingURL=counter-strike-not-running.js.map