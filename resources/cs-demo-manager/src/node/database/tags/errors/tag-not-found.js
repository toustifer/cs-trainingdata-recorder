import { BaseError } from 'csdm/node/errors/base-error';
import { ErrorCode } from 'csdm/common/error-code';
export class TagNotFound extends BaseError {
    constructor() {
        super(ErrorCode.TagNotFound);
        this.message = 'Tag not found';
    }
}
//# sourceMappingURL=tag-not-found.js.map