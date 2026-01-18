import React from 'react';
import { Trans } from '@lingui/react/macro';
import { ContextMenuItem } from 'csdm/ui/components/context-menu/context-menu-item';
import { useShowToast } from '../../toasts/use-show-toast';
import { useUpdateDemoLocation } from 'csdm/ui/hooks/use-update-demo-location';
import { ErrorCode } from 'csdm/common/error-code';
export function UpdateMatchDemoLocationItem({ matches }) {
    const showToast = useShowToast();
    const updateDemoLocation = useUpdateDemoLocation();
    const onClick = async () => {
        try {
            const match = matches[0];
            await updateDemoLocation(match.checksum);
        }
        catch (error) {
            if (error === ErrorCode.ChecksumsMismatch) {
                showToast({
                    content: React.createElement(Trans, null, "This demo is not the same as the one of the match"),
                    type: 'error',
                });
            }
            else {
                showToast({
                    content: React.createElement(Trans, null, "An error occurred"),
                    type: 'error',
                });
            }
        }
    };
    return (React.createElement(ContextMenuItem, { onClick: onClick, isDisabled: matches.length !== 1 },
        React.createElement(Trans, { context: "Context menu" }, "Update demo location")));
}
//# sourceMappingURL=update-match-demo-location-item.js.map