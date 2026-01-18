import React from 'react';
import { Trans } from '@lingui/react/macro';
import { Button, ButtonVariant } from 'csdm/ui/components/buttons/button';
import { AddMapDialog } from 'csdm/ui/settings/maps/add-map-dialog';
import { useDialog } from 'csdm/ui/components/dialogs/use-dialog';
import { MapFormProvider } from 'csdm/ui/settings/maps/map-dialog/map-form-provider';
export function AddMapButton({ game }) {
    const { showDialog } = useDialog();
    const onClick = () => {
        showDialog(React.createElement(MapFormProvider, { game: game },
            React.createElement(AddMapDialog, null)));
    };
    return (React.createElement(React.Fragment, null,
        React.createElement(Button, { onClick: onClick, variant: ButtonVariant.Primary },
            React.createElement(Trans, { context: "Button" }, "Add a map"))));
}
//# sourceMappingURL=add-map-button.js.map