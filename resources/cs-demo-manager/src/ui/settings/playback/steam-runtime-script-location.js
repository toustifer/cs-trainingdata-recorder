import React from 'react';
import { Trans } from '@lingui/react/macro';
import { usePlaybackSettings } from './use-playback-settings';
import { ExecutableLocation } from './executable-location';
export function SteamRuntimeScriptLocation() {
    const { cs2SteamRuntimeScriptPath, customCs2SteamRuntimeScriptLocationEnabled, updateSettings } = usePlaybackSettings();
    return (React.createElement(ExecutableLocation, { title: React.createElement(Trans, null, "Steam runtime script location"), description: React.createElement("div", null,
            React.createElement("p", null,
                React.createElement(Trans, null, "Path to the Steam runtime script used to start CS2. ")),
            React.createElement("p", null,
                React.createElement(Trans, null,
                    "As of September 2025, this script is named ",
                    React.createElement("code", null, "_v2-entry-point"),
                    " and uses the Steam runtime 3 \"Sniper\".")),
            React.createElement("p", null,
                React.createElement(Trans, null,
                    "It should be located in the folder ",
                    React.createElement("code", null, "steamapps/common/SteamLinuxRuntime_sniper"),
                    " inside the folder where Steam is installed."))), executablePath: cs2SteamRuntimeScriptPath, customLocationEnabled: customCs2SteamRuntimeScriptLocationEnabled, updateSettings: async ({ isEnabled, executablePath }) => {
            const payload = {
                ...(isEnabled !== undefined ? { customCs2SteamRuntimeScriptLocationEnabled: isEnabled } : {}),
                ...(executablePath !== undefined ? { cs2SteamRuntimeScriptPath: executablePath } : {}),
            };
            console.log(payload);
            await updateSettings(payload);
        } }));
}
//# sourceMappingURL=steam-runtime-script-location.js.map