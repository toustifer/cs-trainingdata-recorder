import { BaseError } from 'csdm/node/errors/base-error';
import { ErrorCode } from 'csdm/common/error-code';
export class CsgoVoiceExtractorUnknownError extends BaseError {
    constructor() {
        super(ErrorCode.UnknownError);
        this.message = 'An unknown error occurred while running CSGO voice extractor';
    }
}
//# sourceMappingURL=csgo-voice-extractor-unknown-error.js.map