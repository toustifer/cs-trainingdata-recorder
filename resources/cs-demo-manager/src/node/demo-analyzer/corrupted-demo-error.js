import { ErrorCode } from 'csdm/common/error-code';
import { BaseError } from '../errors/base-error';
export class CorruptedDemoError extends BaseError {
    constructor() {
        super(ErrorCode.AnalyzeCorruptedDemo);
        this.message = 'Corrupted demo';
    }
}
//# sourceMappingURL=corrupted-demo-error.js.map