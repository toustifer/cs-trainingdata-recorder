import React from 'react';
import { Trans } from '@lingui/react/macro';
import { Button, ButtonVariant } from 'csdm/ui/components/buttons/button';
import { useDispatch } from 'csdm/ui/store/use-dispatch';
import { useCurrentMatch } from '../../use-current-match';
import { deleteSequences } from './sequences-actions';
import { useCurrentMatchSequences } from './use-current-match-sequences';
export function DeleteSequencesButton() {
    const dispatch = useDispatch();
    const match = useCurrentMatch();
    const sequences = useCurrentMatchSequences();
    const onClick = () => {
        dispatch(deleteSequences({
            demoFilePath: match.demoFilePath,
        }));
    };
    return (React.createElement(Button, { onClick: onClick, variant: sequences.length > 0 ? ButtonVariant.Danger : ButtonVariant.Default },
        React.createElement(Trans, { context: "Button" }, "Delete sequences")));
}
//# sourceMappingURL=delete-sequences-button.js.map