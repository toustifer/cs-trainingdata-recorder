import React from 'react';
import { ThirdPartySettings } from './third-party-settings';
import { ValveLogo } from 'csdm/ui/logos/valve-logo';
export function ValveSettings() {
    return (React.createElement(ThirdPartySettings, { name: "Valve", logo: React.createElement(ValveLogo, { className: "h-20" }), autoDownloadAtStartupSettingsKey: "downloadValveDemosAtStartup", autoDownloadInBackgroundSettingsKey: "downloadValveDemosInBackground" }));
}
//# sourceMappingURL=valve-settings.js.map