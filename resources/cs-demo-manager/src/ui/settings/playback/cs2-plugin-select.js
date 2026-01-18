import React from 'react';
import { Trans } from '@lingui/react/macro';
import { Select } from 'csdm/ui/components/inputs/select';
import { SettingsEntry } from 'csdm/ui/settings/settings-entry';
import { CS2PluginVersion as PluginVersion } from 'csdm/common/types/cs2-plugin-version';
import { ExclamationTriangleIcon } from 'csdm/ui/icons/exclamation-triangle-icon';
import { useFormatDate } from 'csdm/ui/hooks/use-format-date';
import { ExternalLink } from 'csdm/ui/components/external-link';
import { usePlaybackSettings } from './use-playback-settings';
export function Cs2PluginSelect() {
    const { cs2PluginVersion } = usePlaybackSettings();
    const { updateSettings } = usePlaybackSettings();
    const formatDate = useFormatDate();
    const version = cs2PluginVersion ?? PluginVersion.latest;
    const dateOptions = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
    };
    const armoryUpdateDate = formatDate('2024-10-03', dateOptions);
    const animationUpdateDate = formatDate('2025-07-28', dateOptions);
    const update14095 = formatDate('2025-08-14', dateOptions);
    const update14104 = formatDate('2025-09-17', dateOptions);
    const update14112 = formatDate('2025-10-07', dateOptions);
    const options = Object.values(PluginVersion).map((version) => ({
        value: version,
        label: version === PluginVersion.latest ? React.createElement(Trans, null, "Latest") : version,
    }));
    const renderWarning = () => {
        switch (version) {
            case PluginVersion[14030]:
                return (React.createElement("p", null,
                    React.createElement(Trans, null,
                        "You selected a version compatible with CS2 from the Limited Test up to the 'Armory' update (",
                        armoryUpdateDate,
                        ").")));
            case PluginVersion[14088]:
                return (React.createElement("div", null,
                    React.createElement("p", null,
                        React.createElement(Trans, null,
                            "You selected a version compatible with CS2 from the 'Armory' update (",
                            armoryUpdateDate,
                            ") up to the 'Animation' update released on ",
                            animationUpdateDate,
                            ".")),
                    React.createElement("p", null,
                        React.createElement(Trans, null,
                            "If not using a custom build, you must select the CS2 beta branch ",
                            React.createElement("strong", null, "\"1.40.8.8\""),
                            " in your Steam library to use this version."))));
            case PluginVersion[14094]:
                return (React.createElement("p", null,
                    React.createElement(Trans, null,
                        "You selected a version compatible with CS2 from the 'Animation' update (",
                        animationUpdateDate,
                        ") up to the",
                        ' ',
                        update14095,
                        " update.")));
            case PluginVersion[14103]:
                return (React.createElement("p", null,
                    React.createElement(Trans, null,
                        "You selected a version compatible with CS2 from the ",
                        update14095,
                        " update up to the ",
                        update14104,
                        " update.")));
            case PluginVersion[14112]:
                return (React.createElement("div", null,
                    React.createElement("p", null,
                        React.createElement(Trans, null,
                            "You selected a version compatible with CS2 from the ",
                            update14104,
                            " update up to the ",
                            update14112,
                            " update.")),
                    React.createElement("p", null,
                        React.createElement(Trans, null,
                            "If not using a custom build, you must select the CS2 beta branch ",
                            React.createElement("strong", null, "\"1.41.1.2\""),
                            " in your Steam library to use this version."))));
            default:
                return (React.createElement("p", null,
                    React.createElement(Trans, null, "Change this only if you want to watch old demos that are not compatible with the latest CS2 update!")));
        }
    };
    return (React.createElement(SettingsEntry, { interactiveComponent: React.createElement("div", null,
            React.createElement(Select, { options: options, value: cs2PluginVersion ?? PluginVersion.latest, onChange: async (version) => {
                    await updateSettings({
                        cs2PluginVersion: version,
                    });
                } })), description: React.createElement("div", { className: "flex flex-col gap-y-8" },
            React.createElement("div", null,
                React.createElement("p", null,
                    React.createElement(Trans, null, "The version of the internal CS2 plugin used to communicate with the game during playback.")),
                React.createElement("p", null,
                    React.createElement(Trans, null,
                        "See the",
                        ' ',
                        React.createElement(ExternalLink, { href: "https://cs-demo-manager.com/docs/guides/playback#cs2-plugin-compatibility" }, "documentation"),
                        ' ',
                        "for more information."))),
            React.createElement("div", { className: "flex items-center gap-x-4" },
                React.createElement(ExclamationTriangleIcon, { className: "size-16 shrink-0 text-red-700" }),
                renderWarning()),
            window.csdm.isWindows && version !== PluginVersion.latest && (React.createElement("div", { className: "flex items-center gap-x-4" },
                React.createElement(ExclamationTriangleIcon, { className: "size-12 shrink-0 text-orange-700" }),
                React.createElement("div", null,
                    React.createElement("p", { className: "text-caption" },
                        React.createElement(Trans, null, "If you plan to use HLAE, you must install a version of HLAE that is compatible with the selected CS2 beta branch!")))))), title: React.createElement(Trans, { context: "Settings title" }, "CS2 plugin") }));
}
//# sourceMappingURL=cs2-plugin-select.js.map