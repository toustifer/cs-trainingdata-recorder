import React, { useState } from 'react';
import { Trans } from '@lingui/react/macro';
import { CenteredContent } from 'csdm/ui/components/content';
import { Button, ButtonVariant } from 'csdm/ui/components/buttons/button';
import { ErrorCode } from 'csdm/common/error-code';
import { useUpdateDemoLocation } from 'csdm/ui/hooks/use-update-demo-location';
import { ErrorMessage } from 'csdm/ui/components/error-message';
export function UpdateDemoLocation({ checksum, demoFilePath, onUpdated }) {
    const [error, setError] = useState(undefined);
    const updateDemoLocation = useUpdateDemoLocation();
    const onClick = async () => {
        try {
            const newDemoPath = await updateDemoLocation(checksum);
            if (!newDemoPath) {
                return;
            }
            setError(undefined);
            if (typeof onUpdated === 'function') {
                onUpdated(newDemoPath);
            }
        }
        catch (error) {
            if (error === ErrorCode.ChecksumsMismatch) {
                setError(React.createElement(Trans, null, "This demo checksum doesn't match the one associated with the match."));
            }
            else {
                setError(React.createElement(Trans, null, "An error occurred."));
            }
        }
    };
    return (React.createElement(CenteredContent, null,
        React.createElement("div", { className: "flex flex-col gap-y-8" },
            React.createElement("p", null,
                React.createElement(Trans, null,
                    "The demo located at ",
                    React.createElement("code", { className: "selectable" }, demoFilePath),
                    " doesn't exists.")),
            React.createElement("div", { className: "self-center" },
                React.createElement(Button, { onClick: onClick, variant: ButtonVariant.Primary },
                    React.createElement(Trans, { context: "Button" }, "Update demo location"))),
            error !== undefined && React.createElement(ErrorMessage, { message: error }))));
}
//# sourceMappingURL=update-demo-location.js.map