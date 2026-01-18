import { useSyncExternalStore } from 'react';
import { getCssVariableValue } from '../shared/get-css-variable-value';
export function useCssVariableValue(variableName) {
    const subscribe = (onChange) => {
        const observer = new MutationObserver(onChange);
        // Listen for theme changes by observing the class of the html root element.
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        return () => {
            observer.disconnect();
        };
    };
    const getSnapshot = () => {
        return getCssVariableValue(variableName);
    };
    const variable = useSyncExternalStore(subscribe, getSnapshot);
    return variable;
}
//# sourceMappingURL=use-css-variable-value.js.map