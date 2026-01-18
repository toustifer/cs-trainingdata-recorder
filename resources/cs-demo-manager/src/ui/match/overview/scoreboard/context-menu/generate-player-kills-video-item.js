import React from 'react';
import { Trans } from '@lingui/react/macro';
import { generatePlayersKillsSequences } from 'csdm/ui/match/video/sequences/sequences-actions';
import { useDispatch } from 'csdm/ui/store/use-dispatch';
import { ContextMenuItem } from 'csdm/ui/components/context-menu/context-menu-item';
import { useDialog } from 'csdm/ui/components/dialogs/use-dialog';
import { GeneratePlayerEventsDialog } from './generate-player-events-dialog';
export function GeneratePlayerKillsVideoItem({ steamId }) {
    const dispatch = useDispatch();
    const { showDialog } = useDialog();
    const onClick = () => {
        showDialog(React.createElement(GeneratePlayerEventsDialog, { steamId: steamId, secondsBeforeLabel: React.createElement(Trans, { context: "Input label" }, "Seconds before each kill to start the sequence"), secondsAfterLabel: React.createElement(Trans, { context: "Input label" }, "Seconds after each kill to stop the sequence"), generateSequences: (payload) => {
                dispatch(generatePlayersKillsSequences(payload));
            } }));
    };
    return (React.createElement(ContextMenuItem, { onClick: onClick },
        React.createElement(Trans, { context: "Context menu" }, "Kills")));
}
//# sourceMappingURL=generate-player-kills-video-item.js.map