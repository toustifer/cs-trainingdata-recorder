import { BaseError } from 'csdm/node/errors/base-error';
import { ErrorCode } from 'csdm/common/error-code';
export function getErrorCodeFromError(error) {
    return error instanceof BaseError ? error.code : ErrorCode.UnknownError;
}
//# sourceMappingURL=get-error-code-from-error.js.map