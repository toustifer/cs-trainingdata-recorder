import { useBootstrapState } from './use-bootstrap-state';
export function useDatabaseStatus() {
    const state = useBootstrapState();
    return state.databaseStatus;
}
//# sourceMappingURL=use-database-status.js.map