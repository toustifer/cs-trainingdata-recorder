import React, {} from 'react';
import { Button } from './button';
export function OpenLinkButton({ url, children }) {
    const onClick = () => {
        window.open(url);
    };
    return React.createElement(Button, { onClick: onClick }, children);
}
//# sourceMappingURL=open-link-button.js.map