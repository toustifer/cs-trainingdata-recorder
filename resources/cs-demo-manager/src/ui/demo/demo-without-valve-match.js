import React from 'react';
import { ActionBar as CommonActionBar } from 'csdm/ui/components/action-bar';
import { Content } from 'csdm/ui/components/content';
import { SeeMatchButton } from './see-match-button';
import { PreviousDemoLink } from './previous-demo-link';
import { NextDemoLink } from './next-demo-link';
import { RevealDemoInExplorerButton } from './reveal-demo-in-explorer-button';
import { DemoInformation } from './demo-information';
import { DemoMatchStatus } from './demo-match-status';
import { WatchDemoButton } from './watch-demo-button';
import { useCurrentDemo } from './use-current-demo';
import { AnalyzeButton } from 'csdm/ui/components/buttons/analyze-button';
function ActionBar() {
    const demo = useCurrentDemo();
    return (React.createElement(CommonActionBar, { left: React.createElement(React.Fragment, null,
            React.createElement(PreviousDemoLink, null),
            React.createElement(SeeMatchButton, null),
            React.createElement(WatchDemoButton, null),
            React.createElement(AnalyzeButton, { demos: [demo] }),
            React.createElement(RevealDemoInExplorerButton, null),
            React.createElement(NextDemoLink, null)) }));
}
export function DemoWithoutValveMatch() {
    const demo = useCurrentDemo();
    return (React.createElement(React.Fragment, null,
        React.createElement(ActionBar, null),
        React.createElement(Content, null,
            React.createElement("div", { className: "flex" },
                React.createElement(DemoInformation, { demo: demo }),
                React.createElement("div", { className: "ml-4 w-full" },
                    React.createElement(DemoMatchStatus, { demo: demo }))))));
}
//# sourceMappingURL=demo-without-valve-match.js.map