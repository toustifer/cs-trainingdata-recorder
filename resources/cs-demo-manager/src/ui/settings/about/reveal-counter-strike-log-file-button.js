import React, {} from 'react';
import { Trans } from '@lingui/react/macro';
import { Button } from 'csdm/ui/components/buttons/button';
import { Game } from 'csdm/common/types/counter-strike';
import { isSuccessResult } from 'csdm/preload/preload-result';
import { ErrorCode } from 'csdm/common/error-code';
import { useShowToast } from 'csdm/ui/components/toasts/use-show-toast';
export function RevealCounterStrikeLogFileButton({ game }) {
    const showToast = useShowToast();
    const onBrowseClick = async () => {
        const result = await window.csdm.getCounterStrikeLogFilePath(game);
        if (isSuccessResult(result)) {
            return window.csdm.browseToFile(result.success);
        }
        let message;
        if (result.error.code === ErrorCode.FileNotFound) {
            message = React.createElement(Trans, null, "The log file does not exist");
        }
        else {
            message = React.createElement(Trans, null, "An error occurred");
        }
        showToast({ content: message, type: 'error' });
    };
    const gameName = game === Game.CS2 ? 'CS2' : 'CSGO';
    return (React.createElement(Button, { onClick: onBrowseClick },
        React.createElement(Trans, null,
            "Reveal ",
            gameName,
            " log file")));
}
//# sourceMappingURL=reveal-counter-strike-log-file-button.js.map