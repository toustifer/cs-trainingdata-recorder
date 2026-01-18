import React from 'react';
import { Trans } from '@lingui/react/macro';
import { useShowToast } from 'csdm/ui/components/toasts/use-show-toast';
export function useClipboard() {
    const showToast = useShowToast();
    const copyToClipboard = async (value) => {
        await navigator.clipboard.writeText(value);
        showToast({
            content: React.createElement(Trans, { context: "Toast" }, "Copied to clipboard"),
            id: 'copied-to-clipboard',
            type: 'success',
        });
    };
    return {
        copyToClipboard,
    };
}
//# sourceMappingURL=use-clipboard.js.map