import React from 'react';
import { SettingsView } from 'csdm/ui/settings/settings-view';
import { Database } from 'csdm/ui/settings/database/database';
import { DatabaseSize } from './database-size';
import { OptimizeDatabaseButton } from './optimize-database-button';
import { ResetDatabaseButton } from './reset-database-button';
import { ImportV2DataButton } from './import-v2-data-button';
export function DatabaseSettings() {
    return (React.createElement(SettingsView, null,
        React.createElement(DatabaseSize, null),
        React.createElement("div", { className: "mt-8 mb-12 flex gap-8" },
            React.createElement(OptimizeDatabaseButton, null),
            React.createElement(ResetDatabaseButton, null),
            React.createElement(ImportV2DataButton, null)),
        React.createElement(Database, null)));
}
//# sourceMappingURL=database-settings.js.map