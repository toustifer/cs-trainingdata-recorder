import React from 'react';
import { Trans } from '@lingui/react/macro';
import { useShowToast } from 'csdm/ui/components/toasts/use-show-toast';
import { Button } from 'csdm/ui/components/buttons/button';
export function ClearLogsButton() {
    const showToast = useShowToast();
    const onClick = async () => {
        try {
            await logger.clear();
            showToast({
                content: React.createElement(Trans, null, "Log file cleared"),
                id: 'clear-log-file',
                type: 'success',
            });
        }
        catch (error) {
            showToast({
                content: React.createElement(Trans, null, "An error occurred"),
                id: 'clear-log-file',
                type: 'error',
            });
        }
    };
    return (React.createElement(Button, { onClick: onClick },
        React.createElement(Trans, null, "Clear log file")));
}
//# sourceMappingURL=clear-logs-button.js.map