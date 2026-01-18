import React, {} from 'react';
import clsx from 'clsx';
import { useClipboard } from 'csdm/ui/hooks/use-clipboard';
export function DemoField({ label, value, isCopyable }) {
    const { copyToClipboard } = useClipboard();
    const onClick = () => {
        if (isCopyable) {
            copyToClipboard(String(value));
        }
    };
    return (React.createElement("div", { className: "flex flex-col" },
        React.createElement("p", null, label),
        React.createElement("p", { className: clsx('text-body-strong break-all', isCopyable ? 'cursor-pointer select-text' : 'selectable'), onClick: onClick }, value)));
}
//# sourceMappingURL=demo-field.js.map