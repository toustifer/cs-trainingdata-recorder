import ReactDOM from 'react-dom';
import React, { createContext, useState } from 'react';
import { motion } from 'motion/react';
import { makeElementInert, makeElementNonInert } from 'csdm/ui/shared/inert';
import { useFocusLastActiveElement } from 'csdm/ui/hooks/use-focus-last-active-element';
export const DialogContext = createContext({
    showDialog: () => {
        throw new Error('showDialog not implemented');
    },
    hideDialog: () => {
        throw new Error('hideDialog not implemented');
    },
});
export function DialogProvider({ children, inertElementId }) {
    const [dialog, setDialog] = useState(undefined);
    const { focusElement, updateElement } = useFocusLastActiveElement();
    const showDialog = (dialog) => {
        setDialog(dialog);
        updateElement();
        makeElementInert(inertElementId);
    };
    const hideDialog = () => {
        setDialog(undefined);
        makeElementNonInert(inertElementId);
        focusElement();
    };
    return (React.createElement(DialogContext.Provider, { value: {
            showDialog,
            hideDialog,
        } },
        children,
        dialog
            ? ReactDOM.createPortal(React.createElement(motion.div, { className: "absolute inset-0 z-3 focus-within:outline-hidden", initial: { opacity: 0 }, animate: { opacity: 1, transition: { duration: 0.3 } } }, dialog), document.body)
            : null));
}
//# sourceMappingURL=dialog-provider.js.map