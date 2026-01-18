import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { HistoryBackButton } from './history-back-button';
import { HistoryForwardButton } from './history-forward-button';
function isNavigationEvent(event) {
    if (event.shiftKey || event.ctrlKey) {
        return false;
    }
    if (event.target instanceof HTMLInputElement && event.target.value !== '') {
        return false;
    }
    if (window.csdm.isMac) {
        return event.metaKey && !event.altKey;
    }
    return event.altKey && !event.metaKey;
}
function isBackwardKey(key) {
    return window.csdm.isMac ? key === '[' : key === 'ArrowLeft';
}
function isBackwardEvent(event) {
    return isBackwardKey(event.key) && isNavigationEvent(event);
}
function isForwardKey(key) {
    return window.csdm.isMac ? key === ']' : key === 'ArrowRight';
}
function isForwardEvent(event) {
    return isForwardKey(event.key) && isNavigationEvent(event);
}
function useNavigateWithKeyboard() {
    const navigate = useNavigate();
    useEffect(() => {
        const onKeyDown = (event) => {
            if (isBackwardEvent(event)) {
                navigate(-1);
            }
            else if (isForwardEvent(event)) {
                navigate(1);
            }
        };
        window.addEventListener('keydown', onKeyDown);
        return () => {
            window.removeEventListener('keydown', onKeyDown);
        };
    }, [navigate]);
}
export function HistoryNavigation() {
    useNavigateWithKeyboard();
    const onDoubleClick = (event) => {
        // Prevent window resizing on double click
        event.stopPropagation();
    };
    return (React.createElement("div", { className: "flex h-full items-center gap-x-4 no-drag", onDoubleClick: onDoubleClick },
        React.createElement(HistoryBackButton, null),
        React.createElement(HistoryForwardButton, null)));
}
//# sourceMappingURL=history-navigation.js.map