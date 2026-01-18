import { BaseError } from 'csdm/node/errors/base-error';
import { ErrorCode } from 'csdm/common/error-code';
export class TagNameAlreadyTaken extends BaseError {
    constructor() {
        super(ErrorCode.TagNameAlreadyTaken);
        this.message = 'Tag name already taken';
    }
}
//# sourceMappingURL=tag-name-already-taken.js.map