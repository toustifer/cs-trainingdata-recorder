import React from 'react';
import { Trans } from '@lingui/react/macro';
import { ActionBar as CommonActionBar } from 'csdm/ui/components/action-bar';
import { WatchDemoButton } from 'csdm/ui/downloads/watch-demo-button';
import { DownloadSource } from 'csdm/common/download/download-types';
import { DownloadDemoButton } from '../download-demo-button';
import { RevealDemoInExplorerButton } from '../reveal-demo-in-explorer-button';
import { SeeDemoButton } from 'csdm/ui/downloads/see-demo-button';
import { CopyDemoLinkButton } from 'csdm/ui/components/buttons/copy-demo-link-button';
import { useCurrentMatch } from './use-current-match';
import { Match } from './match';
import { OpenLinkButton } from 'csdm/ui/components/buttons/open-link-button';
function DownloadButton() {
    const match = useCurrentMatch();
    const download = {
        game: match.game,
        demoUrl: match.demoUrl,
        fileName: match.id,
        matchId: match.id,
        source: DownloadSource.Renown,
        match,
    };
    return React.createElement(DownloadDemoButton, { status: match.downloadStatus, download: download });
}
function ActionBar() {
    const match = useCurrentMatch();
    return (React.createElement(CommonActionBar, { left: React.createElement(React.Fragment, null,
            React.createElement(DownloadButton, null),
            React.createElement(RevealDemoInExplorerButton, { demoFileName: match.id, downloadStatus: match.downloadStatus }),
            React.createElement(SeeDemoButton, { demoFileName: match.id, downloadStatus: match.downloadStatus }),
            React.createElement(WatchDemoButton, { demoFileName: match.id, game: match.game, downloadStatus: match.downloadStatus }),
            match.demoUrl && React.createElement(CopyDemoLinkButton, { link: match.demoUrl }),
            React.createElement(OpenLinkButton, { url: match.url },
                React.createElement(Trans, { context: "Button" }, "See on Renown")),
            match.leetifyMatchUrl && (React.createElement(OpenLinkButton, { url: match.leetifyMatchUrl },
                React.createElement(Trans, { context: "Button" }, "See on Leetify")))) }));
}
export function CurrentMatch() {
    const match = useCurrentMatch();
    return (React.createElement("div", { className: "flex flex-1 flex-col overflow-auto" },
        React.createElement(ActionBar, null),
        React.createElement(Match, { match: match })));
}
//# sourceMappingURL=current-match.js.map