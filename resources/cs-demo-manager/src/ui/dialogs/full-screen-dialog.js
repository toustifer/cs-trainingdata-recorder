import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { useBlockNavigation } from 'csdm/ui/hooks/use-block-navigation';
import { makeElementInert, makeElementNonInert } from 'csdm/ui/shared/inert';
import { useFocusLastActiveElement } from 'csdm/ui/hooks/use-focus-last-active-element';
import { APP_ELEMENT_ID } from 'csdm/ui/shared/element-ids';
function Dialog({ children }) {
    const container = useRef(null);
    const { updateElement, focusElement } = useFocusLastActiveElement();
    useEffect(() => {
        updateElement();
        makeElementInert(APP_ELEMENT_ID);
        return () => {
            makeElementNonInert(APP_ELEMENT_ID);
            focusElement();
        };
    }, [updateElement, focusElement]);
    useEffect(() => {
        container.current?.focus();
    }, [container]);
    return (React.createElement(motion.div, { ref: container, className: "absolute inset-0 z-1 size-full bg-overlay pt-[var(--title-bar-height)] focus-visible:outline-hidden", tabIndex: -1, initial: { opacity: 0 }, animate: { opacity: 1, transition: { duration: 0.3 } }, exit: { opacity: 0 }, role: "dialog", "aria-modal": "true" }, children));
}
export function FullScreenDialog({ isVisible, children }) {
    useBlockNavigation(isVisible);
    return isVisible ? React.createElement(Dialog, null, children) : null;
}
//# sourceMappingURL=full-screen-dialog.js.map