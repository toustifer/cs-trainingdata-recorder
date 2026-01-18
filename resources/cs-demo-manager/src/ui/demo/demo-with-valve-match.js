import React from 'react';
import { CopyShareCodeButton } from 'csdm/ui/components/buttons/copy-share-code-button';
import { useDispatch } from 'csdm/ui/store/use-dispatch';
import { ActionBar as CommonActionBar } from 'csdm/ui/components/action-bar';
import { ValveMatchOverview } from 'csdm/ui/components/valve-match/valve-match-overview';
import { Content } from 'csdm/ui/components/content';
import { SeeMatchButton } from './see-match-button';
import { NextDemoLink } from './next-demo-link';
import { PreviousDemoLink } from './previous-demo-link';
import { DemoInformation } from './demo-information';
import { RevealDemoInExplorerButton } from './reveal-demo-in-explorer-button';
import { WatchDemoButton } from './watch-demo-button';
import { selectPlayer } from './demo-actions';
import { AnalyzeButton } from 'csdm/ui/components/buttons/analyze-button';
import { useSelectedPlayer } from './use-selected-player';
function ActionBar({ demo }) {
    return (React.createElement(CommonActionBar, { left: React.createElement(React.Fragment, null,
            React.createElement(PreviousDemoLink, null),
            React.createElement(SeeMatchButton, null),
            React.createElement(WatchDemoButton, null),
            React.createElement(AnalyzeButton, { demos: [demo] }),
            React.createElement(RevealDemoInExplorerButton, null),
            React.createElement(CopyShareCodeButton, { shareCode: demo.valveMatch.sharecode }),
            React.createElement(NextDemoLink, null)) }));
}
export function DemoWithValveMatch({ demo }) {
    const dispatch = useDispatch();
    const selectedPlayer = useSelectedPlayer();
    const onPlayerSelected = (player) => {
        dispatch(selectPlayer(player));
    };
    return (React.createElement(React.Fragment, null,
        React.createElement(ActionBar, { demo: demo }),
        React.createElement(Content, null,
            React.createElement("div", { className: "flex" },
                React.createElement(DemoInformation, { demo: demo }),
                React.createElement(ValveMatchOverview, { match: demo.valveMatch, demoPath: demo.filePath, selectedPlayer: selectedPlayer, onPlayerSelected: onPlayerSelected })))));
}
//# sourceMappingURL=demo-with-valve-match.js.map