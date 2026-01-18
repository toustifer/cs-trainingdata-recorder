import React, { useEffect, useState } from 'react';
import { Trans } from '@lingui/react/macro';
import { SettingsEntry } from 'csdm/ui/settings/settings-entry';
import { Select } from 'csdm/ui/components/inputs/select';
import { StartupBehavior } from 'csdm/common/types/startup-behavior';
export function SystemStartupBehavior() {
    // Apple removed the option to hide apps on startup in macOS 13 Ventura
    let isAtLeastMacOs13 = false;
    if (window.csdm.isMac) {
        const osVersion = window.csdm.getAppInformation().osVersion;
        const majorVersionString = osVersion.split('.')[0];
        const majorVersion = parseInt(majorVersionString, 10);
        isAtLeastMacOs13 = majorVersion >= 22;
    }
    const [behavior, setBehavior] = useState(isAtLeastMacOs13 ? StartupBehavior.On : StartupBehavior.Minimized);
    useEffect(() => {
        (async () => {
            setBehavior(await window.csdm.getSystemStartupBehavior());
        })();
    }, []);
    const onChange = async (behavior) => {
        await window.csdm.updateSystemStartupBehavior(behavior);
        setBehavior(behavior);
    };
    const options = isAtLeastMacOs13
        ? []
        : [
            {
                value: StartupBehavior.Minimized,
                label: React.createElement(Trans, null, "Minimized"),
            },
        ];
    options.push(...[
        {
            value: StartupBehavior.Off,
            label: React.createElement(Trans, null, "No"),
        },
        {
            value: StartupBehavior.On,
            label: React.createElement(Trans, null, "Yes"),
        },
    ]);
    return (React.createElement(SettingsEntry, { interactiveComponent: React.createElement(Select, { options: options, onChange: onChange, value: behavior }), description: React.createElement(Trans, null, "Open the application automatically after you log in to your computer"), title: React.createElement(Trans, { context: "Settings title" }, "System startup behavior") }));
}
//# sourceMappingURL=system-startup-behavior.js.map