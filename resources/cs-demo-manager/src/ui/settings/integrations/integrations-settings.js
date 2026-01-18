import React from 'react';
import { Trans } from '@lingui/react/macro';
import { SettingsView } from 'csdm/ui/settings/settings-view';
import { SteamAPIKey } from './steam-api-key';
import { FaceitApiKey } from './faceit-api-key';
export function IntegrationsSettings() {
    return (React.createElement(SettingsView, null,
        React.createElement("div", { className: "flex flex-col gap-y-8" },
            React.createElement("div", null,
                React.createElement("p", { className: "text-body-strong" },
                    React.createElement(Trans, null, "Steam API key")),
                React.createElement("p", null,
                    React.createElement(Trans, null, "Custom Steam API key used to retrieve information from Steam"))),
            React.createElement(SteamAPIKey, null)),
        React.createElement("div", { className: "mt-12 flex flex-col gap-y-8" },
            React.createElement("div", null,
                React.createElement("p", { className: "text-body-strong" },
                    React.createElement(Trans, null, "FACEIT API key")),
                React.createElement("p", null,
                    React.createElement(Trans, null, "Custom FACEIT API key used to retrieve information from FACEIT"))),
            React.createElement(FaceitApiKey, null))));
}
//# sourceMappingURL=integrations-settings.js.map