import { useFaceitState } from './use-faceit-state';
export function useFaceitStatus() {
    const state = useFaceitState();
    return state.status;
}
//# sourceMappingURL=use-faceit-status.js.map