import React, {} from 'react';
import clsx from 'clsx';
import { Trans } from '@lingui/react/macro';
import { PanelValue } from 'csdm/ui/components/panel';
export function WinRate({ title, value, barClassName }) {
    return (React.createElement("div", { className: "w-full" },
        React.createElement("div", { className: "flex justify-between" },
            React.createElement("p", null, title ?? React.createElement(Trans, null, "Win rate")),
            React.createElement(PanelValue, null, `${value}%`)),
        React.createElement("div", { className: "h-4 w-full rounded-full bg-gray-200" },
            React.createElement("div", { className: clsx('h-4 rounded-full', barClassName ?? 'bg-gray-800'), style: {
                    width: `${value}%`,
                } }))));
}
//# sourceMappingURL=win-rate.js.map