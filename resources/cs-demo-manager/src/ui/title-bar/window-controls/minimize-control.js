import React from 'react';
import { Control } from './control';
import { MinimizeIcon } from './minimize-icon';
export function MinimizeControl() {
    const onClick = () => {
        window.csdm.minimizeWindow();
    };
    return (React.createElement(Control, { onClick: onClick },
        React.createElement(MinimizeIcon, null)));
}
//# sourceMappingURL=minimize-control.js.map