import { useRef } from 'react';
export function useFocusLastActiveElement() {
    const lastActiveElement = useRef(null);
    const updateElement = () => {
        lastActiveElement.current = document.activeElement;
    };
    const focusElement = () => {
        const elementToFocus = lastActiveElement.current;
        if (elementToFocus instanceof HTMLElement) {
            window.requestIdleCallback(() => {
                elementToFocus.focus();
                lastActiveElement.current = null;
            });
        }
    };
    return {
        updateElement,
        focusElement,
    };
}
//# sourceMappingURL=use-focus-last-active-element.js.map