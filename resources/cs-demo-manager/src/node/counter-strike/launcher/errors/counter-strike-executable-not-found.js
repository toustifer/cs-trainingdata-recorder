import { BaseError } from 'csdm/node/errors/base-error';
import { ErrorCode } from 'csdm/common/error-code';
export class CounterStrikeExecutableNotFound extends BaseError {
    game;
    constructor(game) {
        super(ErrorCode.CounterStrikeExecutableNotFound);
        this.message = 'CS executable not found';
        this.game = game;
    }
}
//# sourceMappingURL=counter-strike-executable-not-found.js.map