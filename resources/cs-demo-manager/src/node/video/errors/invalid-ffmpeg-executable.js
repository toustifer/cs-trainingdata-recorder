import { BaseError } from 'csdm/node/errors/base-error';
import { ErrorCode } from 'csdm/common/error-code';
export class InvalidFfmpegExecutable extends BaseError {
    constructor() {
        super(ErrorCode.InvalidFfmpegExecutable);
        this.message = 'Invalid FFmpeg executable';
    }
}
//# sourceMappingURL=invalid-ffmpeg-executable.js.map