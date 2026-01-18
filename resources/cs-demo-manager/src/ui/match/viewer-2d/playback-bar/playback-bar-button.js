import React from 'react';
export function PlaybackBarButton({ children, ref, onClick, isDisabled }) {
    return (React.createElement("button", { ref: ref, className: "flex min-w-40 cursor-pointer items-center justify-center border-r border-r-gray-300 bg-gray-50 p-8 text-gray-900 transition-all duration-85 last:border-r-0 hover:enabled:bg-gray-100 disabled:opacity-50", onClick: onClick, disabled: isDisabled },
        React.createElement("div", null, children)));
}
//# sourceMappingURL=playback-bar-button.js.map