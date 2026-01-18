import React from 'react';
import { Trans } from '@lingui/react/macro';
import { ActionBar as CommonActionBar } from 'csdm/ui/components/action-bar';
import { WatchDemoButton } from 'csdm/ui/downloads/watch-demo-button';
import { DownloadSource } from 'csdm/common/download/download-types';
import { DownloadDemoButton } from '../download-demo-button';
import { RevealDemoInExplorerButton } from '../reveal-demo-in-explorer-button';
import { SeeDemoButton } from 'csdm/ui/downloads/see-demo-button';
import { CopyDemoLinkButton } from 'csdm/ui/components/buttons/copy-demo-link-button';
import { useCurrent5EPlayMatch } from './use-current-5eplay-match';
import { FiveEPlayMatch } from './5eplay-match';
import { OpenLinkButton } from 'csdm/ui/components/buttons/open-link-button';
function SeeOn5EplayButton() {
    const match = useCurrent5EPlayMatch();
    return (React.createElement(OpenLinkButton, { url: match.url },
        React.createElement(Trans, { context: "Button" }, "See on 5EPlay")));
}
function DownloadButton() {
    const match = useCurrent5EPlayMatch();
    const download = {
        game: match.game,
        demoUrl: match.demoUrl,
        fileName: match.id,
        matchId: match.id,
        source: DownloadSource['5EPlay'],
        match,
    };
    return React.createElement(DownloadDemoButton, { status: match.downloadStatus, download: download });
}
function ActionBar() {
    const match = useCurrent5EPlayMatch();
    return (React.createElement(CommonActionBar, { left: React.createElement(React.Fragment, null,
            React.createElement(DownloadButton, null),
            React.createElement(RevealDemoInExplorerButton, { demoFileName: match.id, downloadStatus: match.downloadStatus }),
            React.createElement(SeeDemoButton, { demoFileName: match.id, downloadStatus: match.downloadStatus }),
            React.createElement(WatchDemoButton, { demoFileName: match.id, game: match.game, downloadStatus: match.downloadStatus }),
            match.demoUrl && React.createElement(CopyDemoLinkButton, { link: match.demoUrl }),
            React.createElement(SeeOn5EplayButton, null)) }));
}
export function FiveEPlayCurrentMatch() {
    const match = useCurrent5EPlayMatch();
    return (React.createElement("div", { className: "flex flex-1 flex-col overflow-auto" },
        React.createElement(ActionBar, null),
        React.createElement(FiveEPlayMatch, { match: match })));
}
//# sourceMappingURL=5eplay-current-match.js.map