import { BaseError } from 'csdm/node/errors/base-error';
import { ErrorCode } from 'csdm/common/error-code';
export class InvalidTagColor extends BaseError {
    constructor() {
        super(ErrorCode.InvalidTagColor);
        this.message = 'Invalid tag color';
    }
}
//# sourceMappingURL=invalid-tag-color.js.map