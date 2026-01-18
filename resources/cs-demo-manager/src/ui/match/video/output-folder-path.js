import React from 'react';
import { Trans, useLingui } from '@lingui/react/macro';
import { useVideoSettings } from 'csdm/ui/settings/video/use-video-settings';
import { FileOrDirectoryInput } from 'csdm/ui/components/inputs/file-or-directory-input';
export function OutputFolderPath() {
    const { t } = useLingui();
    const { settings, updateSettings } = useVideoSettings();
    const onFileSelected = async (folderPath) => {
        await updateSettings({
            outputFolderPath: folderPath,
        });
    };
    return (React.createElement(FileOrDirectoryInput, { type: "folder", placeholder: t({
            comment: 'Input placeholder',
            message: 'Output folder',
        }), name: "output-folder", label: React.createElement(Trans, { context: "Input label" }, "Output folder"), dialogTitle: t({
            context: 'Dialog title',
            message: 'Select output folder',
        }), onFileSelected: onFileSelected, path: settings.outputFolderPath }));
}
//# sourceMappingURL=output-folder-path.js.map