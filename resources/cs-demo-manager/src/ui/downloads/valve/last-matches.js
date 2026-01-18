import React from 'react';
import { ActionBar } from './action-bar';
import { Sidebar } from './sidebar';
import { CurrentMatch } from './current-match';
export function LastMatches() {
    return (React.createElement(React.Fragment, null,
        React.createElement(ActionBar, null),
        React.createElement("div", { className: "flex overflow-hidden" },
            React.createElement(Sidebar, null),
            React.createElement(CurrentMatch, null))));
}
//# sourceMappingURL=last-matches.js.map