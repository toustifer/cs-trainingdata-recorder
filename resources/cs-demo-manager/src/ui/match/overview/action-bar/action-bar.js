import React from 'react';
import { ActionBar } from 'csdm/ui/components/action-bar';
import { WatchMatchButton } from 'csdm/ui/match/overview/action-bar/watch-match-button';
import { WatchMatchAtTickButton } from 'csdm/ui/match/overview/action-bar/watch-match-at-tick-button';
import { RevealMatchDemoInExplorerButton } from 'csdm/ui/match/overview/action-bar/reveal-match-demo-in-explorer-button';
import { SeeDemoButton } from './see-demo-button';
import { CopyMatchShareCodeButton } from './copy-match-share-code';
import { ExportMatchAsXlsxButton } from './export-match-as-xlsx-button';
import { ExportMatchToJsonButton } from './export-match-to-json-button';
import { ScoreboardColumnsVisibility } from './scoreboard-columns-visibility';
export function MatchActionBar() {
    return (React.createElement(ActionBar, { left: React.createElement(React.Fragment, null,
            React.createElement(WatchMatchButton, null),
            React.createElement(WatchMatchAtTickButton, null),
            React.createElement(RevealMatchDemoInExplorerButton, null),
            React.createElement(SeeDemoButton, null),
            React.createElement(CopyMatchShareCodeButton, null),
            React.createElement(ExportMatchAsXlsxButton, null),
            React.createElement(ExportMatchToJsonButton, null)), right: React.createElement(ScoreboardColumnsVisibility, null) }));
}
//# sourceMappingURL=action-bar.js.map