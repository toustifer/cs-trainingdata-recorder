import React from 'react';
import { Trans } from '@lingui/react/macro';
import { ExecutableLocation } from './executable-location';
import { usePlaybackSettings } from './use-playback-settings';
function buildDescription() {
    if (window.csdm.isWindows) {
        return (React.createElement("p", null,
            React.createElement(Trans, null,
                "Path to the ",
                React.createElement("code", null, "cs2.exe"),
                " file located in the ",
                React.createElement("code", null, "game\\bin\\win64"),
                " folder of your CS2 installation.")));
    }
    return (React.createElement("p", null,
        React.createElement(Trans, null,
            "Path to the ",
            React.createElement("code", null, "cs2.sh"),
            " script located in the ",
            React.createElement("code", null, "game"),
            " folder of your CS2 installation.")));
}
export function Cs2Location() {
    const { cs2ExecutablePath, customCs2LocationEnabled, updateSettings } = usePlaybackSettings();
    return (React.createElement(ExecutableLocation, { title: React.createElement(Trans, null, "CS2 location"), description: buildDescription(), executablePath: cs2ExecutablePath, customLocationEnabled: customCs2LocationEnabled, expectedExecutableName: window.csdm.isWindows ? 'cs2.exe' : 'cs2.sh', updateSettings: async ({ isEnabled, executablePath }) => {
            const payload = {
                ...(isEnabled !== undefined ? { customCs2LocationEnabled: isEnabled } : {}),
                ...(executablePath !== undefined ? { cs2ExecutablePath: executablePath } : {}),
            };
            await updateSettings(payload);
        } }));
}
//# sourceMappingURL=cs2-location.js.map