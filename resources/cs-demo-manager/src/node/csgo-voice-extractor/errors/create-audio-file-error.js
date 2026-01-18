import { BaseError } from 'csdm/node/errors/base-error';
import { ErrorCode } from 'csdm/common/error-code';
export class CreateAudioFileError extends BaseError {
    constructor() {
        super(ErrorCode.CsVoiceExtractorCreateAudioFileError);
        this.message = 'Failed to create audio file';
    }
}
//# sourceMappingURL=create-audio-file-error.js.map