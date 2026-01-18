import { useValveState } from './use-valve-state';
export function useErrorCode() {
    const state = useValveState();
    return state.errorCode;
}
//# sourceMappingURL=use-error-code.js.map