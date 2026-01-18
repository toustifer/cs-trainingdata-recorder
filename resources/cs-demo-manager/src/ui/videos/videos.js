import React from 'react';
import { Trans } from '@lingui/react/macro';
import { useVideos } from 'csdm/ui/videos/use-videos';
import { Message } from 'csdm/ui/components/message';
import { VideoEntry } from 'csdm/ui/videos/video-entry';
import { Content } from 'csdm/ui/components/content';
import { RemoveCompletedVideosButton } from './remove-completed-videos-button';
import { RemoveAllVideosButton } from './remove-all-videos-button';
import { ResumeOrPauseVideoQueueButton } from './resume-or-pause-video-queue-button';
export function Videos() {
    const videos = useVideos();
    if (videos.length === 0) {
        return React.createElement(Message, { message: React.createElement(Trans, null, "No video generation in progress.") });
    }
    return (React.createElement(Content, null,
        React.createElement("div", { className: "flex items-center gap-x-8" },
            React.createElement(ResumeOrPauseVideoQueueButton, null),
            React.createElement(RemoveCompletedVideosButton, null),
            React.createElement(RemoveAllVideosButton, null)),
        React.createElement("div", { className: "mt-12 flex flex-col gap-y-12" }, videos.map((video) => {
            return React.createElement(VideoEntry, { key: video.id, video: video });
        }))));
}
//# sourceMappingURL=videos.js.map