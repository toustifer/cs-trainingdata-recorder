import { BaseError } from 'csdm/node/errors/base-error';
import { ErrorCode } from 'csdm/common/error-code';
export class FileNotFound extends BaseError {
    constructor(filePath) {
        super(ErrorCode.FileNotFound);
        this.message = `File not found: ${filePath}`;
    }
}
//# sourceMappingURL=file-not-found.js.map