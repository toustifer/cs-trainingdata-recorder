import React from 'react';
import { Trans } from '@lingui/react/macro';
import { DemoSource, Game } from 'csdm/common/types/counter-strike';
import { CenteredContent } from 'csdm/ui/components/content';
import { useCurrentMatch } from '../use-current-match';
import { useFormatDate } from 'csdm/ui/hooks/use-format-date';
export function EmptyChatMessages() {
    const match = useCurrentMatch();
    const formatDate = useFormatDate();
    const renderValveNotice = () => {
        if (match.game === Game.CSGO) {
            return (React.createElement("p", null,
                React.createElement(Trans, null,
                    "Chat messages are available only if the ",
                    React.createElement("code", null, ".info"),
                    " file of the demo is next to its ",
                    React.createElement("code", null, ".dem"),
                    ' ',
                    "file during analysis.")));
        }
        const updateDate = formatDate('2024-05-29', {
            hour: undefined,
            minute: undefined,
            second: undefined,
        });
        return (React.createElement("p", null,
            React.createElement(Trans, null,
                "Chat messages are available with Valve demos only after the ",
                updateDate,
                " CS2 update.")));
    };
    return (React.createElement(CenteredContent, null,
        React.createElement("p", { className: "text-subtitle" },
            React.createElement(Trans, null, "No chat messages found.")),
        match.source === DemoSource.Valve && renderValveNotice()));
}
//# sourceMappingURL=empty-chat-messages.js.map