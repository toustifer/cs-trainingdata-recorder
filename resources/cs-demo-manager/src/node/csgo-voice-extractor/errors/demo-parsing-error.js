import { BaseError } from 'csdm/node/errors/base-error';
import { ErrorCode } from 'csdm/common/error-code';
export class DemoParsingError extends BaseError {
    constructor() {
        super(ErrorCode.CsVoiceExtractorParsingError);
        this.message = 'Error while parsing demo';
    }
}
//# sourceMappingURL=demo-parsing-error.js.map