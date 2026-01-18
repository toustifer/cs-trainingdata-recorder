import React from 'react';
import { Trans } from '@lingui/react/macro';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from 'csdm/ui/dialogs/dialog';
import { Button } from 'csdm/ui/components/buttons/button';
import { useDialog } from 'csdm/ui/components/dialogs/use-dialog';
import { CancelButton } from '../buttons/cancel-button';
export function SelectPovDialog({ onPlayerClick, onEnemyClick }) {
    const { hideDialog } = useDialog();
    return (React.createElement(Dialog, null,
        React.createElement(DialogHeader, null,
            React.createElement(DialogTitle, null,
                React.createElement(Trans, null, "Point of view"))),
        React.createElement(DialogContent, null,
            React.createElement("p", null,
                React.createElement(Trans, null, "Do you want to watch it from the player's POV or the enemy's POV?"))),
        React.createElement(DialogFooter, null,
            React.createElement(Button, { onClick: () => {
                    hideDialog();
                    onPlayerClick();
                } },
                React.createElement(Trans, { context: "Watch from player point of view" }, "Player")),
            React.createElement(Button, { onClick: () => {
                    hideDialog();
                    onEnemyClick();
                } },
                React.createElement(Trans, { context: "Watch from enemy point of view" }, "Enemy")),
            React.createElement(CancelButton, { onClick: hideDialog }))));
}
//# sourceMappingURL=select-pov-dialog.js.map