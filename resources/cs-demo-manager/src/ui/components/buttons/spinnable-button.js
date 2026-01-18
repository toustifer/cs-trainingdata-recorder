import React from 'react';
import { Button, ButtonVariant } from 'csdm/ui/components/buttons/button';
import { Spinner } from '../spinner';
export function SpinnableButton({ children, isLoading = false, isDisabled, variant, ...props }) {
    return (React.createElement(Button, { isDisabled: isDisabled ?? isLoading, variant: variant ?? ButtonVariant.Primary, ...props },
        React.createElement("div", { className: isLoading ? 'opacity-0' : 'opacity-100' }, children),
        isLoading && (React.createElement("div", { className: "absolute left-1/2 -translate-x-1/2" },
            React.createElement(Spinner, { size: 20 })))));
}
//# sourceMappingURL=spinnable-button.js.map