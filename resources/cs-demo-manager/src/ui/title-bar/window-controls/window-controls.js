import React from 'react';
import { MaximizeControl } from './maximize-control';
import { MinimizeControl } from './minimize-control';
import { CloseControl } from './close-control';
export function WindowControls() {
    return (React.createElement("div", { className: "z-10 flex h-full items-center no-drag" },
        React.createElement(MinimizeControl, null),
        React.createElement(MaximizeControl, null),
        React.createElement(CloseControl, null)));
}
//# sourceMappingURL=window-controls.js.map