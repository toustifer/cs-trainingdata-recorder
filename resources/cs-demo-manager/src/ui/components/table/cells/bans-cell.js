import React from 'react';
import clsx from 'clsx';
import { Trans } from '@lingui/react/macro';
import { Tooltip } from 'csdm/ui/components/tooltip';
function Circle({ ref, className }) {
    return React.createElement("div", { ref: ref, className: clsx('size-8 rounded-full', className) });
}
export function BansCell({ showVacBanned, showGameBanned, showCommunityBanned }) {
    return (React.createElement("div", { className: "flex flex-col items-center gap-y-4" },
        showVacBanned && (React.createElement(Tooltip, { content: React.createElement(Trans, { context: "Tooltip" }, "VAC banned"), renderInPortal: true },
            React.createElement(Circle, { className: "bg-vac-ban" }))),
        showGameBanned && (React.createElement(Tooltip, { content: React.createElement(Trans, { context: "Tooltip" }, "Game banned"), renderInPortal: true },
            React.createElement(Circle, { className: "bg-game-ban" }))),
        showCommunityBanned && (React.createElement(Tooltip, { content: React.createElement(Trans, { context: "Tooltip" }, "Community banned"), renderInPortal: true },
            React.createElement(Circle, { className: "bg-community-ban" })))));
}
//# sourceMappingURL=bans-cell.js.map