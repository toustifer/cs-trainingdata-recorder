import React from 'react';
import { Trans } from '@lingui/react/macro';
import { Switch } from 'csdm/ui/components/inputs/switch';
import { SettingsEntry } from 'csdm/ui/settings/settings-entry';
import { useUpdateSettings } from '../use-update-settings';
import { useUiSettings } from './use-ui-settings';
import { useDialog } from 'csdm/ui/components/dialogs/use-dialog';
import { ConfirmDialog } from 'csdm/ui/dialogs/confirm-dialog';
import { ButtonVariant } from 'csdm/ui/components/buttons/button';
function ConfirmRestartDialog({ enableHardwareAcceleration }) {
    const updateSettings = useUpdateSettings();
    return (React.createElement(ConfirmDialog, { title: React.createElement(Trans, null, "Hardware Acceleration"), confirmButtonVariant: ButtonVariant.Danger, onConfirm: async () => {
            await updateSettings({
                ui: {
                    enableHardwareAcceleration,
                },
            });
            window.csdm.restartApp();
        } },
        React.createElement(Trans, null, "Changing this setting will relaunch the application.")));
}
export function EnableHardwareAcceleration() {
    const { enableHardwareAcceleration } = useUiSettings();
    const { showDialog } = useDialog();
    const onChange = (isChecked) => {
        showDialog(React.createElement(ConfirmRestartDialog, { enableHardwareAcceleration: isChecked }));
    };
    return (React.createElement(SettingsEntry, { interactiveComponent: React.createElement(Switch, { isChecked: enableHardwareAcceleration, onChange: onChange }), description: React.createElement(Trans, null, "Uses your GPU to make the app smoother. Turn this off if you are experiencing visual problems."), title: React.createElement(Trans, { context: "Settings title" }, "Hardware Acceleration") }));
}
//# sourceMappingURL=enable-hardware-acceleration.js.map