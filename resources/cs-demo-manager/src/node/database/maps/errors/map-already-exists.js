import { BaseError } from 'csdm/node/errors/base-error';
import { ErrorCode } from 'csdm/common/error-code';
export class MapAlreadyExists extends BaseError {
    constructor() {
        super(ErrorCode.MapAlreadyExists);
        this.message = 'Map already exists';
    }
}
//# sourceMappingURL=map-already-exists.js.map