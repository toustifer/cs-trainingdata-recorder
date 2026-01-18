import React, { useEffect, useState } from 'react';
import { Trans } from '@lingui/react/macro';
import { SettingsView } from 'csdm/ui/settings/settings-view';
import { useWebSocketClient } from 'csdm/ui/hooks/use-web-socket-client';
import { RendererClientMessageName } from 'csdm/server/renderer-client-message-name';
import { CopyButton } from 'csdm/ui/components/buttons/copy-button';
import { ExternalLink } from 'csdm/ui/components/external-link';
import { RevealLogFileButton } from 'csdm/ui/components/buttons/reveal-log-file-button';
import { ClearLogsButton } from './clear-logs-button';
import { ResetSettingsButton } from './reset-settings-button';
import { SettingsEntry } from '../settings-entry';
import { Switch } from 'csdm/ui/components/inputs/switch';
import { useSettings } from '../use-settings';
import { useUpdateSettings } from '../use-update-settings';
import { Donate } from 'csdm/ui/components/donate';
import { SeeChangelogButton } from './see-changelog-button';
import { RevealCounterStrikeLogFileButton } from './reveal-counter-strike-log-file-button';
import { Game } from 'csdm/common/types/counter-strike';
export function About() {
    const client = useWebSocketClient();
    const [migrations, setMigrations] = useState([]);
    const info = window.csdm.getAppInformation();
    const { autoDownloadUpdates } = useSettings();
    const updateSettings = useUpdateSettings();
    useEffect(() => {
        (async () => {
            const result = await client.send({
                name: RendererClientMessageName.FetchLastMigrations,
            });
            setMigrations(result);
        })();
    }, [client]);
    /* eslint-disable lingui/no-unlocalized-strings */
    const data = [
        `Version: ${APP_VERSION}`,
        `OS: ${info.platform} ${info.arch} ${info.osVersion}`,
        `Electron: ${info.electronVersion}`,
        `Chrome: ${info.chromeVersion}`,
        'Last database migrations:',
        ...migrations.map((migration) => `v${migration.version} - ${migration.date}`),
    ];
    /* eslint-enable lingui/no-unlocalized-strings */
    return (React.createElement(SettingsView, null,
        React.createElement("div", { className: "flex flex-col gap-y-20" },
            React.createElement("h2", { className: "text-title" }, "CS Demo Manager"),
            React.createElement("section", { className: "flex flex-col gap-y-8" },
                React.createElement(SettingsEntry, { interactiveComponent: React.createElement(Switch, { isChecked: autoDownloadUpdates, onChange: (isChecked) => {
                            window.csdm.toggleAutoDownloadUpdates(isChecked);
                            updateSettings({
                                autoDownloadUpdates: isChecked,
                            });
                        } }), description: React.createElement(Trans, null, "Automatically download updates."), title: React.createElement(Trans, { context: "Settings title" }, "Auto update") }),
                React.createElement("div", null,
                    React.createElement(SeeChangelogButton, null))),
            React.createElement("section", { className: "flex flex-col" },
                React.createElement("h2", { className: "text-subtitle" },
                    React.createElement(Trans, null, "Information")),
                data.map((line) => (React.createElement("p", { key: line, className: "selectable" }, line))),
                React.createElement("div", { className: "mt-4 flex items-center gap-x-8" },
                    React.createElement(CopyButton, { data: data.join('\n') }),
                    React.createElement(ResetSettingsButton, null))),
            React.createElement("section", { className: "flex flex-col" },
                React.createElement("h2", { className: "text-subtitle" },
                    React.createElement(Trans, null, "Logs")),
                React.createElement("div", { className: "mt-4 flex items-center gap-x-8" },
                    React.createElement(RevealLogFileButton, null),
                    React.createElement(ClearLogsButton, null),
                    React.createElement(RevealCounterStrikeLogFileButton, { game: Game.CS2 }),
                    React.createElement(RevealCounterStrikeLogFileButton, { game: Game.CSGO }))),
            React.createElement("section", null,
                React.createElement("h3", { className: "text-subtitle" },
                    React.createElement(Trans, null, "Credits")),
                React.createElement("p", null,
                    React.createElement(Trans, null, "Special thanks to the following developers for their open-source work related to Counter-Strike that at some point helped create CS Demo Manager \u2764\uFE0F.")),
                React.createElement("ul", { className: "mt-4 selectable" },
                    React.createElement("li", null,
                        React.createElement(Trans, null,
                            React.createElement(ExternalLink, { href: "https://github.com/DandrewsDev" }, "@DandrewsDev"),
                            " for his work on CS2 demos",
                            ' ',
                            React.createElement(ExternalLink, { href: "https://github.com/DandrewsDev/CS2VoiceData" }, "voice data extraction"),
                            ".")),
                    React.createElement("li", null,
                        React.createElement(Trans, null,
                            React.createElement(ExternalLink, { href: "https://github.com/dtugend" }, "@dtugend"),
                            ", the main developer of",
                            ' ',
                            React.createElement(ExternalLink, { href: "https://github.com/advancedfx/advancedfx" }, "HLAE"),
                            " which CS Demo Manager uses to generate videos. Without HLAE the CS moviemaking community would not be the same. You can support the HLAE team",
                            ' ',
                            React.createElement(ExternalLink, { href: "https://www.advancedfx.org/credits/#donors" }, "here"),
                            ".")),
                    React.createElement("li", null,
                        React.createElement(Trans, null,
                            React.createElement(ExternalLink, { href: "https://github.com/GAMMACASE" }, "@GAMMACASE"),
                            ",",
                            ' ',
                            React.createElement(ExternalLink, { href: "https://github.com/zer0k-z" }, "@zer0.k"),
                            " and other AlliedModders contributors to the",
                            ' ',
                            React.createElement(ExternalLink, { href: "https://github.com/alliedmodders/hl2sdk/tree/cs2" }, "CS2 SDK"),
                            " internally used by CS Demo Manager.")),
                    React.createElement("li", null,
                        React.createElement(Trans, null,
                            React.createElement(ExternalLink, { href: "https://github.com/LaihoE" }, "@LaihoE"),
                            " for his reverse engineering work on CS2 demo parsing. His parser is available on",
                            ' ',
                            React.createElement(ExternalLink, { href: "https://github.com/LaihoE/demoparser" }, "GitHub"),
                            ".")),
                    React.createElement("li", null,
                        React.createElement(Trans, null,
                            React.createElement(ExternalLink, { href: "https://github.com/main--" }, "@main--"),
                            " and",
                            ' ',
                            React.createElement(ExternalLink, { href: "https://github.com/moritzuehling" }, "@moritzuehling"),
                            " for creating",
                            ' ',
                            React.createElement(ExternalLink, { href: "https://github.com/StatsHelix/demoinfo" }, "DemoInfo"),
                            ", one of the first CSGO demo parsers used for years in CSGO Demo Manager V2.")),
                    React.createElement("li", null,
                        React.createElement(Trans, null,
                            React.createElement(ExternalLink, { href: "https://github.com/markus-wa" }, "@markus-wa"),
                            " for creating and maintaining",
                            ' ',
                            React.createElement(ExternalLink, { href: "https://github.com/markus-wa/demoinfocs-golang" }, "demoinfocs-golang"),
                            ", the demo parser internally used by CS Demo Manager V3.")),
                    React.createElement("li", null,
                        React.createElement(Trans, null,
                            React.createElement(ExternalLink, { href: "https://github.com/saul" }, "@saul"),
                            ", a Source Engine/CS wizard who created a ",
                            React.createElement(ExternalLink, { href: "https://github.com/saul/demofile" }, "CSGO"),
                            " and",
                            ' ',
                            React.createElement(ExternalLink, { href: "https://github.com/saul/demofile-net" }, "CS2"),
                            " demo parser and share his CS related knowledge through various",
                            ' ',
                            React.createElement(ExternalLink, { href: "https://github.com/saul/cvar-unhide-s2" }, "open-source"),
                            ' ',
                            React.createElement(ExternalLink, { href: "https://github.com/saul/node-csgo-voice" }, "projects"),
                            ". You can support him on ",
                            React.createElement(ExternalLink, { href: "https://github.com/sponsors/saul" }, "GitHub"),
                            ".")))),
            React.createElement("section", null,
                React.createElement(Donate, null)))));
}
//# sourceMappingURL=about.js.map