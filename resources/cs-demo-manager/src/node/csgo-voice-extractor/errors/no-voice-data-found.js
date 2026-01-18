import { BaseError } from 'csdm/node/errors/base-error';
import { ErrorCode } from 'csdm/common/error-code';
export class NoVoiceDataFound extends BaseError {
    constructor() {
        super(ErrorCode.CsVoiceExtractorNoVoiceDataFound);
        this.message = 'No voice data found';
    }
}
//# sourceMappingURL=no-voice-data-found.js.map