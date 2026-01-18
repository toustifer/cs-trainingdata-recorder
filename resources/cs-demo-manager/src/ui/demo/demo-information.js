import React from 'react';
import { Trans } from '@lingui/react/macro';
import { DemoCommentInput } from './demo-comment-input';
import { Source } from './demo-source';
import { DemoNameInput } from './demo-name-input';
import { DemoMap } from './demo-map';
import { DemoDuration } from './demo-duration';
import { DemoDate } from './demo-date';
import { DemoTags } from './demo-tags';
import { DemoField } from './demo-field';
import { roundNumber } from 'csdm/common/math/round-number';
export function DemoInformation({ demo }) {
    return (React.createElement("div", { className: "mr-12 flex max-w-[354px] min-w-[354px] flex-col gap-y-8" },
        React.createElement(DemoMap, { mapName: demo.mapName, game: demo.game }),
        React.createElement(DemoDate, { date: demo.date }),
        React.createElement(DemoDuration, { duration: demo.duration }),
        React.createElement(Source, { source: demo.source }),
        React.createElement(DemoField, { label: React.createElement(Trans, null, "Path:"), value: demo.filePath, isCopyable: true }),
        demo.shareCode !== '' && (React.createElement(DemoField, { label: React.createElement(Trans, null, "Share code:"), value: demo.shareCode, isCopyable: true })),
        React.createElement(DemoTags, { checksum: demo.checksum, tagIds: demo.tagIds }),
        React.createElement(DemoNameInput, { checksum: demo.checksum, currentName: demo.name }),
        React.createElement(DemoCommentInput, { currentComment: demo.comment, checksum: demo.checksum }),
        React.createElement(DemoField, { label: React.createElement(Trans, null, "Server name:"), value: demo.serverName }),
        React.createElement(DemoField, { label: React.createElement(Trans, null, "Client name:"), value: demo.clientName }),
        React.createElement("div", { className: "flex gap-x-16" },
            React.createElement(DemoField, { label: React.createElement(Trans, null, "Tickrate:"), value: demo.tickrate }),
            React.createElement(DemoField, { label: React.createElement(Trans, null, "Framerate:"), value: roundNumber(demo.frameRate) }))));
}
//# sourceMappingURL=demo-information.js.map