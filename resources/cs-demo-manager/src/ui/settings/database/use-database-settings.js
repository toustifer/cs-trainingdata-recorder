import { useSettings } from '../use-settings';
export function useDatabaseSettings() {
    const settings = useSettings();
    return settings.database;
}
//# sourceMappingURL=use-database-settings.js.map