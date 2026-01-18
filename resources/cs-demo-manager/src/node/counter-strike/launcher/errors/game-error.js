import { BaseError } from 'csdm/node/errors/base-error';
import { ErrorCode } from 'csdm/common/error-code';
export class GameError extends BaseError {
    constructor() {
        super(ErrorCode.GameError);
        this.message = 'Game error';
    }
}
//# sourceMappingURL=game-error.js.map