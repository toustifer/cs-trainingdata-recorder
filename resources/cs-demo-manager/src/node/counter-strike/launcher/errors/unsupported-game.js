import { BaseError } from 'csdm/node/errors/base-error';
import { ErrorCode } from 'csdm/common/error-code';
export class UnsupportedGame extends BaseError {
    game;
    constructor(game) {
        super(ErrorCode.UnsupportedGame);
        this.message = `${game} is not supported on this platform`;
        this.game = game;
    }
}
//# sourceMappingURL=unsupported-game.js.map