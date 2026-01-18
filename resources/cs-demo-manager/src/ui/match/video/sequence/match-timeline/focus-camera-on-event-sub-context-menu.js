import React, {} from 'react';
import { Plural, Trans } from '@lingui/react/macro';
import { ContextMenuItem } from 'csdm/ui/components/context-menu/context-menu-item';
import { SubContextMenu } from 'csdm/ui/components/context-menu/sub-context-menu';
import { useDialog } from 'csdm/ui/components/dialogs/use-dialog';
import { useCurrentMatch } from 'csdm/ui/match/use-current-match';
import { SelectSecondsDialog } from './select-seconds-dialog';
export function FocusCameraOnEventSubContextMenu({ label, startTick, eventTick, onSubmit }) {
    const { showDialog } = useDialog();
    const match = useCurrentMatch();
    const seconds = [1, 2, 3, 4, 5, 10];
    return (React.createElement(SubContextMenu, { label: label },
        React.createElement(ContextMenuItem, { onClick: () => {
                onSubmit(startTick);
            } },
            React.createElement(Trans, { context: "Context menu" }, "At the start of the sequence")),
        seconds.map((second) => {
            return (React.createElement(ContextMenuItem, { key: second, onClick: () => {
                    onSubmit(eventTick - Math.round(second * match.tickrate));
                } },
                React.createElement(Plural, { value: second, one: "# second before", other: "# seconds before" })));
        }),
        React.createElement(ContextMenuItem, { onClick: () => {
                showDialog(React.createElement(SelectSecondsDialog, { tick: eventTick, operation: "minus", onSubmit: onSubmit }));
            } },
            React.createElement(Trans, { context: "Context menu" }, "X seconds before"))));
}
//# sourceMappingURL=focus-camera-on-event-sub-context-menu.js.map