import { BaseError } from 'csdm/node/errors/base-error';
import { ErrorCode } from 'csdm/common/error-code';
export class CustomCounterStrikeExecutableNotFound extends BaseError {
    game;
    constructor(game) {
        super(ErrorCode.CustomCounterStrikeExecutableNotFound);
        this.message = 'Custom CS executable not found';
        this.game = game;
    }
}
//# sourceMappingURL=custom-counter-strike-executable-not-found.js.map