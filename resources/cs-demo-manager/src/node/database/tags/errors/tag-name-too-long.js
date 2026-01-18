import { BaseError } from 'csdm/node/errors/base-error';
import { ErrorCode } from 'csdm/common/error-code';
export class TagNameTooLong extends BaseError {
    constructor() {
        super(ErrorCode.TagNameTooLong);
        this.message = 'Tag name too long';
    }
}
//# sourceMappingURL=tag-name-too-long.js.map