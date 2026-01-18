import React from 'react';
import { Trans } from '@lingui/react/macro';
import { Button } from 'csdm/ui/components/buttons/button';
import { useCurrentMatch } from 'csdm/ui/match/use-current-match';
import { useCurrentMatchSequences } from 'csdm/ui/match/video/sequences/use-current-match-sequences';
import { useDialog } from 'csdm/ui/components/dialogs/use-dialog';
import { useShowToast } from 'csdm/ui/components/toasts/use-show-toast';
import { SequencePlayersOptionsProvider } from './player-options/players-options-provider';
import { EditSequenceSettingsDialog } from './edit-sequences-settings-dialog';
export function EditSequencesSettingsButton() {
    const { showDialog } = useDialog();
    const showToast = useShowToast();
    const match = useCurrentMatch();
    const sequences = useCurrentMatchSequences();
    const onClick = () => {
        if (sequences.length === 0) {
            showToast({
                id: 'no-sequences',
                content: React.createElement(Trans, null, "No sequences to edit"),
                type: 'warning',
            });
        }
        else {
            showDialog(React.createElement(SequencePlayersOptionsProvider, { match: match },
                React.createElement(EditSequenceSettingsDialog, null)));
        }
    };
    return (React.createElement(Button, { onClick: onClick },
        React.createElement(Trans, { context: "Button" }, "Edit sequences settings")));
}
//# sourceMappingURL=edit-sequences-settings-button.js.map