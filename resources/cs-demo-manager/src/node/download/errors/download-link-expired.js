import { BaseError } from 'csdm/node/errors/base-error';
import { ErrorCode } from 'csdm/common/error-code';
export class DownloadLinkExpired extends BaseError {
    constructor() {
        super(ErrorCode.DemoLinkExpired);
        this.message = 'Download link expired';
    }
}
//# sourceMappingURL=download-link-expired.js.map