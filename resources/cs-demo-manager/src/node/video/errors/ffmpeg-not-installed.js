import { BaseError } from 'csdm/node/errors/base-error';
import { ErrorCode } from 'csdm/common/error-code';
export class FfmpegNotInstalled extends BaseError {
    constructor() {
        super(ErrorCode.FfmpegNotInstalled);
        this.message = 'FFmpeg is not installed';
    }
}
//# sourceMappingURL=ffmpeg-not-installed.js.map