import React from 'react';
import { Trans } from '@lingui/react/macro';
import { Button } from 'csdm/ui/components/buttons/button';
import { useShowToast } from '../toasts/use-show-toast';
export function RevealLogFileButton() {
    const showToast = useShowToast();
    const onBrowseClick = async () => {
        const logFilePath = logger.getLogFilePath();
        if (!(await window.csdm.pathExists(logFilePath))) {
            return showToast({
                type: 'error',
                content: React.createElement(Trans, null, "The log file does not exist"),
            });
        }
        window.csdm.browseToFile(logFilePath);
    };
    return (React.createElement(Button, { onClick: onBrowseClick },
        React.createElement(Trans, null, "Reveal log file")));
}
//# sourceMappingURL=reveal-log-file-button.js.map