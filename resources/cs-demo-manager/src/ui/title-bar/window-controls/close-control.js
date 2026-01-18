import React from 'react';
import { CloseIcon } from './close-icon';
import { Control } from './control';
export function CloseControl() {
    const onClick = () => {
        window.csdm.closeWindow();
    };
    return (React.createElement(Control, { variant: "danger", onClick: onClick },
        React.createElement(CloseIcon, null)));
}
//# sourceMappingURL=close-control.js.map