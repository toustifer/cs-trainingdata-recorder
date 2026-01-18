import React from 'react';
import { AnalysesLink } from './analyses-link';
import { SettingsButton } from './settings-button';
import { DownloadsLink } from './downloads-link';
import { PinnedPlayerLink } from './pinned-player-link';
import { PlayersLink } from './players-link';
import { BansLink } from './bans-link';
import { MatchesLink } from './matches-link';
import { DemosLink } from './demos-link';
import { SearchLink } from './search-link';
import { TeamsLink } from './teams-link';
import { VideoQueueLink } from './video-queue-link';
export function LeftBar() {
    return (React.createElement("div", { className: "flex no-scrollbar h-full w-[60px] flex-col items-center overflow-y-auto border-r border-r-gray-300 bg-gray-50" },
        React.createElement(PinnedPlayerLink, null),
        React.createElement("div", { className: "my-8 flex w-full px-12" },
            React.createElement("div", { className: "h-px w-full bg-gray-600" })),
        React.createElement(MatchesLink, null),
        React.createElement(DemosLink, null),
        React.createElement(PlayersLink, null),
        React.createElement(TeamsLink, null),
        React.createElement(DownloadsLink, null),
        React.createElement(BansLink, null),
        React.createElement(SearchLink, null),
        React.createElement(AnalysesLink, null),
        React.createElement(VideoQueueLink, null),
        React.createElement(SettingsButton, null)));
}
//# sourceMappingURL=left-bar.js.map