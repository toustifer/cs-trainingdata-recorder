import React from 'react';
import { PortInput } from '../../components/inputs/port-input';
import { DatabaseNameInput } from '../../components/inputs/database-name-input';
import { UsernameInput } from '../../components/inputs/username-input';
import { PasswordInput } from '../../components/inputs/password-input';
import { DisconnectDatabaseButton } from './disconnect-database-button';
import { useDatabaseSettings } from './use-database-settings';
import { HostnameInput } from 'csdm/ui/components/inputs/hostname-input';
export function Database() {
    const { hostname, port, username, password, database } = useDatabaseSettings();
    return (React.createElement("div", { className: "flex max-w-[264px] flex-col gap-y-8" },
        React.createElement(HostnameInput, { hostname: hostname }),
        React.createElement(DatabaseNameInput, { databaseName: database }),
        React.createElement(UsernameInput, { username: username }),
        React.createElement(PasswordInput, { password: password }),
        React.createElement(PortInput, { port: port }),
        React.createElement("div", { className: "mt-12" },
            React.createElement(DisconnectDatabaseButton, null))));
}
//# sourceMappingURL=database.js.map