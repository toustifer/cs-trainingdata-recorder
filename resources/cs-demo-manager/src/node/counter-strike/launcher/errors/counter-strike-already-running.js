import { BaseError } from 'csdm/node/errors/base-error';
import { ErrorCode } from 'csdm/common/error-code';
export class CounterStrikeAlreadyRunning extends BaseError {
    game;
    constructor(game) {
        super(ErrorCode.CounterStrikeAlreadyRunning);
        this.message = 'Counter-Strike is already running';
        this.game = game;
    }
}
//# sourceMappingURL=counter-strike-already-running.js.map