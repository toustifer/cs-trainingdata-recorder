import React from 'react';
import { Trans } from '@lingui/react/macro';
import { Tooltip } from 'csdm/ui/components/tooltip';
import { HeadshotIcon } from 'csdm/ui/icons/headshot-icon';
import { PenetrateIcon } from 'csdm/ui/icons/penetrate-icon';
import { BlindIcon } from 'csdm/ui/icons/blind-icon';
import { JumpIcon } from 'csdm/ui/icons/jump-icon';
export function KillAttributesCell({ data: kill }) {
    const iconSize = 24;
    return (React.createElement("div", { className: "flex gap-x-4 px-4" },
        kill.isHeadshot && (React.createElement(Tooltip, { content: React.createElement(Trans, { context: "Tooltip kill" }, "Headshot") },
            React.createElement(HeadshotIcon, { height: iconSize }))),
        kill.penetratedObjects > 0 && (React.createElement(Tooltip, { content: React.createElement(Trans, { context: "Tooltip kill" }, "Wallbang") },
            React.createElement(PenetrateIcon, { height: iconSize }))),
        kill.isKillerBlinded && (React.createElement(Tooltip, { content: React.createElement(Trans, { context: "Tooltip kill" }, "Blinded") },
            React.createElement(BlindIcon, { height: iconSize }))),
        kill.isKillerAirborne && (React.createElement(Tooltip, { content: React.createElement(Trans, { context: "Tooltip kill" }, "Jump kill") },
            React.createElement(JumpIcon, { height: iconSize })))));
}
//# sourceMappingURL=kill-attributes-cell.js.map