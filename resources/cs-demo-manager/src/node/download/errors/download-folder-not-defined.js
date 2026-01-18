import { BaseError } from 'csdm/node/errors/base-error';
import { ErrorCode } from 'csdm/common/error-code';
export class DownloadFolderNotDefined extends BaseError {
    constructor() {
        super(ErrorCode.DownloadFolderNotDefined);
        this.message = 'Download folder not defined';
    }
}
//# sourceMappingURL=download-folder-not-defined.js.map