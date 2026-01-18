import { ErrorCode } from './error-code';
export function isErrorCode(error) {
    return typeof error === 'number' && Object.values(ErrorCode).includes(error);
}
//# sourceMappingURL=is-error-code.js.map