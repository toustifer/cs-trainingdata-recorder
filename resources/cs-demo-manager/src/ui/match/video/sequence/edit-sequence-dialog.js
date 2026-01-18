import React from 'react';
import { useCurrentMatch } from 'csdm/ui/match/use-current-match';
import { useDispatch } from 'csdm/ui/store/use-dispatch';
import { SequenceDialog } from './sequence-dialog';
import { updateSequence } from '../sequences/sequences-actions';
export function EditSequenceDialog({ closeDialog, sequence }) {
    const dispatch = useDispatch();
    const match = useCurrentMatch();
    const onSaveClick = (sequenceForm) => {
        const sequence = {
            ...sequenceForm,
            startTick: Number(sequenceForm.startTick),
            endTick: Number(sequenceForm.endTick),
        };
        dispatch(updateSequence({ demoFilePath: match.demoFilePath, sequence }));
    };
    return (React.createElement(SequenceDialog, { initialSequence: sequence, isVisible: sequence !== undefined, closeDialog: closeDialog, onSaveClick: onSaveClick }));
}
//# sourceMappingURL=edit-sequence-dialog.js.map