import { ErrorCode } from 'csdm/common/error-code';
import { getErrorCodeFromError } from 'csdm/server/get-error-code-from-error';
export function handleError(error, message) {
    const errorCode = getErrorCodeFromError(error);
    if (errorCode === ErrorCode.UnknownError) {
        logger.error(message);
        logger.error(error);
    }
    throw errorCode;
}
//# sourceMappingURL=handle-error.js.map