import React, { useState } from 'react';
export function AccountAvatar({ url, playerName }) {
    const [src, setSrc] = useState(url || window.csdm.getDefaultPlayerAvatar());
    return (React.createElement("img", { className: "w-32", src: src, alt: playerName, title: playerName, onError: () => {
            setSrc(window.csdm.getDefaultPlayerAvatar());
        } }));
}
//# sourceMappingURL=account-avatar.js.map