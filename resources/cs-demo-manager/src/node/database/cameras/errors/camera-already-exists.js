import { BaseError } from 'csdm/node/errors/base-error';
import { ErrorCode } from 'csdm/common/error-code';
export class CameraAlreadyExists extends BaseError {
    constructor() {
        super(ErrorCode.CameraAlreadyExists);
        this.message = 'Camera already exists';
    }
}
//# sourceMappingURL=camera-already-exists.js.map