import React from 'react';
import { Trans } from '@lingui/react/macro';
import { Button } from 'csdm/ui/components/buttons/button';
import { useVideos } from 'csdm/ui/videos/use-videos';
import { useRemoveVideos } from 'csdm/ui/videos/use-remove-videos';
export function RemoveAllVideosButton() {
    const videos = useVideos();
    const { isRemovingVideos, removeVideos } = useRemoveVideos();
    return (React.createElement(Button, { isDisabled: isRemovingVideos, onClick: async () => {
            await removeVideos(videos.map((video) => video.id));
        } },
        React.createElement(Trans, { context: "Button" }, "Remove all")));
}
//# sourceMappingURL=remove-all-videos-button.js.map