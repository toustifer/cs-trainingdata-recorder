import { ErrorCode } from 'csdm/common/error-code';
import { CommandError } from './command-error';
export class FFmpegError extends CommandError {
    constructor(output) {
        super(ErrorCode.FfmpegError, 'FFmpeg error', output);
    }
}
//# sourceMappingURL=ffmpeg-error.js.map