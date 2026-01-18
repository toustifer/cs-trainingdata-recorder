import React, { createContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
export const ContextMenuContext = createContext({
    showContextMenu: () => {
        throw new Error('showContextMenu not implemented');
    },
    hideContextMenu: () => {
        throw new Error('hideContextMenu not implemented');
    },
});
export function ContextMenuProvider({ children }) {
    const positionRef = useRef({ x: 0, y: 0 });
    const wrapperRef = useRef(null);
    const [contextMenu, setContextMenu] = useState(undefined);
    const hideContextMenu = () => {
        setContextMenu(undefined);
    };
    const showContextMenu = (event, contextMenu) => {
        event.preventDefault();
        positionRef.current = { x: event.clientX, y: event.clientY };
        setContextMenu(contextMenu);
    };
    const onWrapperMouseDown = (event) => {
        event.stopPropagation();
    };
    useEffect(() => {
        const wrapper = wrapperRef.current;
        if (wrapper === null) {
            return;
        }
        const onWindowClick = (event) => {
            if (event.target instanceof Node && wrapper.contains(event.target)) {
                event.preventDefault();
            }
            else {
                hideContextMenu();
            }
        };
        window.addEventListener('click', onWindowClick);
        return () => {
            window.removeEventListener('click', onWindowClick);
        };
    });
    useEffect(() => {
        const onWindowKeyDown = (event) => {
            if (event.key === 'Escape') {
                hideContextMenu();
            }
        };
        window.addEventListener('keydown', onWindowKeyDown);
        return () => {
            window.removeEventListener('keydown', onWindowKeyDown);
        };
    });
    useEffect(() => {
        window.navigation?.addEventListener('navigate', hideContextMenu);
        return () => {
            window.navigation?.removeEventListener('navigate', hideContextMenu);
        };
    });
    useLayoutEffect(() => {
        if (!wrapperRef.current) {
            return;
        }
        const { offsetWidth: menuWidth, offsetHeight: menuHeight } = wrapperRef.current;
        let x = positionRef.current.x;
        let y = positionRef.current.y;
        if (x + menuWidth > window.innerWidth) {
            x -= x + menuWidth - window.innerWidth;
        }
        if (y + menuHeight > window.innerHeight) {
            y -= y + menuHeight - window.innerHeight;
        }
        wrapperRef.current.setAttribute('style', `left: ${x}px; top:${y}px;`);
    });
    return (React.createElement(ContextMenuContext.Provider, { value: {
            hideContextMenu,
            showContextMenu,
        } },
        children,
        contextMenu ? (React.createElement(motion.div, { className: "absolute z-1", ref: wrapperRef, onMouseDown: onWrapperMouseDown, initial: { opacity: 0 }, animate: { opacity: 1, transition: { duration: 0.3 } } }, contextMenu)) : null));
}
//# sourceMappingURL=context-menu-provider.js.map