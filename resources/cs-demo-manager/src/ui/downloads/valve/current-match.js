import React from 'react';
import { CopyShareCodeButton } from 'csdm/ui/components/buttons/copy-share-code-button';
import { WatchDemoButton } from 'csdm/ui/downloads/watch-demo-button';
import { ActionBar } from 'csdm/ui/components/action-bar';
import { useDispatch } from 'csdm/ui/store/use-dispatch';
import { ValveMatchOverview } from 'csdm/ui/components/valve-match/valve-match-overview';
import { useSelectedMatch } from './use-selected-match';
import { MatchDownloadDemoButton } from './download-demo-button';
import { steamIdSelected } from './valve-actions';
import { RevealDemoInExplorerButton } from '../reveal-demo-in-explorer-button';
import { SeeDemoButton } from '../see-demo-button';
import { useGetDownloadedDemoPath } from 'csdm/ui/downloads/use-get-downloaded-demo-path';
import { DownloadStatus } from 'csdm/common/types/download-status';
import { useSelectedPlayer } from './use-selected-player';
import { CopyDemoLinkButton } from 'csdm/ui/components/buttons/copy-demo-link-button';
export function CurrentMatch() {
    const match = useSelectedMatch();
    const dispatch = useDispatch();
    const downloadedDemoPath = useGetDownloadedDemoPath(match.name);
    const demoPath = match.downloadStatus === DownloadStatus.Downloaded ? downloadedDemoPath : undefined;
    const selectedPlayer = useSelectedPlayer();
    const onPlayerSelected = (player) => {
        dispatch(steamIdSelected({
            steamId: player.steamId,
        }));
    };
    return (React.createElement("div", { className: "flex flex-1 flex-col overflow-auto" },
        React.createElement(ActionBar, { left: React.createElement(React.Fragment, null,
                React.createElement(MatchDownloadDemoButton, null),
                React.createElement(RevealDemoInExplorerButton, { demoFileName: match.name, downloadStatus: match.downloadStatus }),
                React.createElement(SeeDemoButton, { demoFileName: match.name, downloadStatus: match.downloadStatus }),
                React.createElement(WatchDemoButton, { demoFileName: match.name, game: match.game, downloadStatus: match.downloadStatus }),
                match.demoUrl && React.createElement(CopyDemoLinkButton, { link: match.demoUrl }),
                React.createElement(CopyShareCodeButton, { shareCode: match.sharecode })) }),
        React.createElement("div", { className: "flex flex-1 flex-col overflow-auto p-16" },
            React.createElement(ValveMatchOverview, { match: match, demoPath: demoPath, selectedPlayer: selectedPlayer, onPlayerSelected: onPlayerSelected }))));
}
//# sourceMappingURL=current-match.js.map