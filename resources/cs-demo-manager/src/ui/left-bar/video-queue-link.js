import React from 'react';
import { Trans } from '@lingui/react/macro';
import { RoutePath } from 'csdm/ui/routes-paths';
import { LeftBarLink } from './left-bar-link';
import { PendingVideosBadge } from './pending-videos-badge';
import { VideoIcon } from '../icons/video-icon';
export function VideoQueueLink() {
    return (React.createElement(LeftBarLink, { icon: React.createElement("div", { className: "relative size-full" },
            React.createElement(PendingVideosBadge, null),
            React.createElement(VideoIcon, null)), tooltip: React.createElement(Trans, { context: "Tooltip" }, "Videos"), url: RoutePath.Videos }));
}
//# sourceMappingURL=video-queue-link.js.map