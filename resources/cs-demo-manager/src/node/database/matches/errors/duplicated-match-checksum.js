import { BaseError } from 'csdm/node/errors/base-error';
import { ErrorCode } from 'csdm/common/error-code';
export class DuplicatedMatchChecksum extends BaseError {
    constructor(cause) {
        super(ErrorCode.InsertMatchDuplicatedChecksum, cause);
        this.message = 'Duplicated match checksum';
    }
}
//# sourceMappingURL=duplicated-match-checksum.js.map