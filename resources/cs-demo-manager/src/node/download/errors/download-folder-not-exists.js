import { BaseError } from 'csdm/node/errors/base-error';
import { ErrorCode } from 'csdm/common/error-code';
export class DownloadFolderNotExists extends BaseError {
    constructor() {
        super(ErrorCode.DownloadFolderNotExists);
        this.message = `Download folder doesn't exist`;
    }
}
//# sourceMappingURL=download-folder-not-exists.js.map