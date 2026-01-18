import React, { createContext, useEffect, useRef, useState } from 'react';
export const FullscreenContext = createContext({
    toggleFullscreen: () => {
        throw new Error('toggleFullscreen not implemented');
    },
    isFullscreenEnabled: false,
});
export function FullscreenProvider({ children }) {
    const wrapper = useRef(null);
    const [isFullscreenEnabled, setIsFullscreenEnabled] = useState(false);
    useEffect(() => {
        const onFullscreenChange = () => {
            setIsFullscreenEnabled(document.fullscreenElement !== null);
        };
        document.addEventListener('fullscreenchange', onFullscreenChange);
        return () => {
            document.removeEventListener('fullscreenchange', onFullscreenChange);
        };
    }, []);
    return (React.createElement("div", { className: "flex flex-1 flex-col", ref: wrapper },
        React.createElement(FullscreenContext.Provider, { value: {
                toggleFullscreen: async () => {
                    if (isFullscreenEnabled) {
                        await document.exitFullscreen();
                    }
                    else {
                        await wrapper.current?.requestFullscreen();
                    }
                },
                isFullscreenEnabled,
            } }, children)));
}
//# sourceMappingURL=fullscreen-provider.js.map