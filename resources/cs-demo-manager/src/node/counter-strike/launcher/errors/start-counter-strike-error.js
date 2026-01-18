import { ErrorCode } from 'csdm/common/error-code';
import { CommandError } from 'csdm/node/video/errors/command-error';
export class StartCounterStrikeError extends CommandError {
    constructor(output) {
        super(ErrorCode.StartCounterStrikeError, 'Failed to start Counter-Strike', output);
    }
}
//# sourceMappingURL=start-counter-strike-error.js.map