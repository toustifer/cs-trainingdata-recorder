import React, { useState } from 'react';
import clsx from 'clsx';
import { getPlayerColorBorderClassName } from 'csdm/ui/styles/get-player-color-border-class-name';
export function Avatar({ avatarUrl, playerName, playerColor, size }) {
    const defaultAvatarPath = window.csdm.getDefaultPlayerAvatar();
    const [src, setSrc] = useState(avatarUrl);
    const onError = () => {
        setSrc(defaultAvatarPath);
    };
    return (React.createElement("img", { className: clsx('size-[100px] border', playerColor ? getPlayerColorBorderClassName(playerColor) : 'border-gray-300'), style: {
            width: size,
            height: size,
        }, title: playerName, src: src || defaultAvatarPath, onError: onError }));
}
//# sourceMappingURL=avatar.js.map