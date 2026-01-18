import React from 'react';
import { SettingsView } from 'csdm/ui/settings/settings-view';
import { LaunchParameters } from './launch-parameters';
import { CustomHighlights } from './custom-highlights';
import { GameFullscreen } from './game-fullscreen';
import { GameHeight } from './game-height';
import { GameWidth } from './game-width';
import { HighlightsWatchBeforeKillDelay } from './highlights-watch-before-kill-delay';
import { HighlightsWatchAfterKillDelay } from './highlights-watch-after-kill-delay';
import { LowlightsWatchBeforeKillDelay } from './lowlights-watch-before-kill-delay';
import { LowlightsWatchAfterKillDelay } from './lowlights-watch-after-kill-delay';
import { CustomLowlights } from './custom-lowlights';
import { WatchRoundBeforeDelay } from './watch-round-before-delay';
import { WatchRoundAfterDelay } from './watch-round-after-delay';
import { UseHlae } from './use-hlae';
import { PlayerVoices } from './player-voices';
import { HighlightsIncludeDamages } from './highlights-include-damages';
import { LowlightsIncludeDamages } from './lowlights-include-damages';
import { Cs2PluginSelect } from './cs2-plugin-select';
import { Cs2Location } from './cs2-location';
import { CsgoLocation } from './csgo-location';
import { FollowSymbolicLinks } from './follow-symbolic-links';
import { SteamRuntimeScriptLocation } from './steam-runtime-script-location';
export function PlaybackSettings() {
    return (React.createElement(SettingsView, null,
        React.createElement(GameWidth, null),
        React.createElement(GameHeight, null),
        React.createElement(GameFullscreen, null),
        React.createElement(LaunchParameters, null),
        React.createElement(PlayerVoices, null),
        React.createElement(CustomHighlights, null),
        React.createElement(HighlightsWatchBeforeKillDelay, null),
        React.createElement(HighlightsWatchAfterKillDelay, null),
        React.createElement(HighlightsIncludeDamages, null),
        React.createElement(CustomLowlights, null),
        React.createElement(LowlightsWatchBeforeKillDelay, null),
        React.createElement(LowlightsWatchAfterKillDelay, null),
        React.createElement(LowlightsIncludeDamages, null),
        React.createElement(WatchRoundBeforeDelay, null),
        React.createElement(WatchRoundAfterDelay, null),
        window.csdm.isWindows && React.createElement(UseHlae, null),
        window.csdm.isLinux && (React.createElement(React.Fragment, null,
            React.createElement(FollowSymbolicLinks, null),
            React.createElement(SteamRuntimeScriptLocation, null))),
        !window.csdm.isMac && (React.createElement(React.Fragment, null,
            React.createElement(Cs2PluginSelect, null),
            React.createElement(Cs2Location, null),
            React.createElement(CsgoLocation, null)))));
}
//# sourceMappingURL=playback-settings.js.map