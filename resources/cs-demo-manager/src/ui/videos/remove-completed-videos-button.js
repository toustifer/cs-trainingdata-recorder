import React from 'react';
import { Trans } from '@lingui/react/macro';
import { Button, ButtonVariant } from 'csdm/ui/components/buttons/button';
import { useDispatch } from 'csdm/ui/store/use-dispatch';
import { removeCompletedVideos } from 'csdm/ui/videos/videos-actions';
export function RemoveCompletedVideosButton() {
    const dispatch = useDispatch();
    return (React.createElement(Button, { variant: ButtonVariant.Default, onClick: () => {
            dispatch(removeCompletedVideos());
        } },
        React.createElement(Trans, { context: "Button" }, "Remove completed")));
}
//# sourceMappingURL=remove-completed-videos-button.js.map