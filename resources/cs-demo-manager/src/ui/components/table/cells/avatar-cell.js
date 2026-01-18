import React, { useState } from 'react';
import { getPlayerColorBorderClassName } from 'csdm/ui/styles/get-player-color-border-class-name';
export function AvatarCell({ avatarUrl, playerName, playerColor }) {
    const [src, setSrc] = useState(avatarUrl || window.csdm.getDefaultPlayerAvatar());
    return (React.createElement("img", { src: src, className: playerColor ? `border ${getPlayerColorBorderClassName(playerColor)}` : undefined, alt: playerName, title: playerName, onError: () => {
            setSrc(window.csdm.getDefaultPlayerAvatar());
        } }));
}
//# sourceMappingURL=avatar-cell.js.map