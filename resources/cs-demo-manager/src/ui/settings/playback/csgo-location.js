import React from 'react';
import { Trans } from '@lingui/react/macro';
import { ExecutableLocation } from './executable-location';
import { usePlaybackSettings } from './use-playback-settings';
function buildDescription() {
    if (window.csdm.isWindows) {
        return (React.createElement("p", null,
            React.createElement(Trans, null,
                "Path to the ",
                React.createElement("code", null, "csgo.exe"),
                " file located in the root folder of your CS:GO installation.")));
    }
    return (React.createElement("p", null,
        React.createElement(Trans, null,
            "Path to the ",
            React.createElement("code", null, "csgo.sh"),
            " script located in the root folder of your CS:GO installation.")));
}
export function CsgoLocation() {
    const { csgoExecutablePath, customCsgoLocationEnabled, updateSettings } = usePlaybackSettings();
    return (React.createElement(ExecutableLocation, { title: React.createElement(Trans, null, "CS:GO location"), description: buildDescription(), executablePath: csgoExecutablePath, customLocationEnabled: customCsgoLocationEnabled, expectedExecutableName: window.csdm.isWindows ? 'csgo.exe' : 'csgo.sh', updateSettings: async ({ isEnabled, executablePath }) => {
            const payload = {
                ...(isEnabled !== undefined ? { customCsgoLocationEnabled: isEnabled } : {}),
                ...(executablePath !== undefined ? { csgoExecutablePath: executablePath } : {}),
            };
            await updateSettings(payload);
        } }));
}
//# sourceMappingURL=csgo-location.js.map