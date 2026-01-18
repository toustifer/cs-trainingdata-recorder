import { BaseError } from 'csdm/node/errors/base-error';
import { ErrorCode } from 'csdm/common/error-code';
export class TagNameTooShort extends BaseError {
    constructor() {
        super(ErrorCode.TagNameTooShort);
        this.message = 'Tag name too short';
    }
}
//# sourceMappingURL=tag-name-too-short.js.map