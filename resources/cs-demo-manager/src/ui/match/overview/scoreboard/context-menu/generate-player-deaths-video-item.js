import React from 'react';
import { Trans } from '@lingui/react/macro';
import { generatePlayersDeathsSequences } from 'csdm/ui/match/video/sequences/sequences-actions';
import { useDispatch } from 'csdm/ui/store/use-dispatch';
import { ContextMenuItem } from 'csdm/ui/components/context-menu/context-menu-item';
import { useDialog } from 'csdm/ui/components/dialogs/use-dialog';
import { GeneratePlayerEventsDialog } from './generate-player-events-dialog';
export function GeneratePlayerDeathsVideoItem({ steamId }) {
    const dispatch = useDispatch();
    const { showDialog } = useDialog();
    const onClick = () => {
        showDialog(React.createElement(GeneratePlayerEventsDialog, { steamId: steamId, secondsBeforeLabel: React.createElement(Trans, { context: "Input label" }, "Seconds before each death to start the sequence"), secondsAfterLabel: React.createElement(Trans, { context: "Input label" }, "Seconds after each death to stop the sequence"), generateSequences: (payload) => {
                dispatch(generatePlayersDeathsSequences(payload));
            } }));
    };
    return (React.createElement(ContextMenuItem, { onClick: onClick },
        React.createElement(Trans, { context: "Context menu" }, "Deaths")));
}
//# sourceMappingURL=generate-player-deaths-video-item.js.map