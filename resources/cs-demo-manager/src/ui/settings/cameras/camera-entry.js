import React from 'react';
import { Trans, useLingui } from '@lingui/react/macro';
import { Button } from 'csdm/ui/components/buttons/button';
import { DeleteButton } from 'csdm/ui/components/buttons/delete-button';
import { useGetCameraImageSrc } from 'csdm/ui/cameras/use-get-camera-image-src';
import { CameraFormProvider } from './form/camera-form-provider';
import { DeleteCameraDialog } from './delete-camera-dialog';
import { useDialog } from 'csdm/ui/components/dialogs/use-dialog';
import { useShowToast } from 'csdm/ui/components/toasts/use-show-toast';
import { EditCameraDialog } from './edit-camera-dialog';
import { KebabMenu, KebabMenuItem } from 'csdm/ui/components/kebab-menu';
export function CameraEntry({ camera }) {
    const getCameraImageSrc = useGetCameraImageSrc();
    const { showDialog } = useDialog();
    const showToast = useShowToast();
    const { t } = useLingui();
    return (React.createElement("div", { className: "w-[294px] rounded border border-gray-300" },
        React.createElement("img", { src: getCameraImageSrc(camera.id), alt: camera.name }),
        React.createElement("div", { className: "p-8" },
            React.createElement("div", { className: "flex items-center gap-x-8" },
                React.createElement("div", { className: "size-10 min-w-10 rounded-full", style: { backgroundColor: camera.color } }),
                React.createElement("p", { className: "line-clamp-2", title: camera.name }, camera.name)),
            React.createElement("div", { className: "mt-8 flex flex-col gap-8" },
                React.createElement("div", { className: "flex flex-wrap items-center gap-8" },
                    React.createElement(Button, { onClick: async () => {
                            const previewBase64 = await window.csdm.getCameraPreviewBase64(camera.id);
                            const initialValues = {
                                name: camera.name,
                                x: String(camera.x),
                                y: String(camera.y),
                                z: String(camera.z),
                                pitch: String(camera.pitch),
                                yaw: String(camera.yaw),
                                comment: String(camera.comment),
                                color: camera.color,
                                previewBase64,
                            };
                            showDialog(React.createElement(CameraFormProvider, { id: camera.id, game: camera.game, mapName: camera.mapName, initialValues: initialValues },
                                React.createElement(EditCameraDialog, { id: camera.id })));
                        } },
                        React.createElement(Trans, { context: "Button" }, "Edit")),
                    React.createElement(DeleteButton, { onClick: () => {
                            showDialog(React.createElement(DeleteCameraDialog, { cameraId: camera.id }));
                        } }),
                    React.createElement("div", { className: "h-30" },
                        React.createElement(KebabMenu, { label: t `Camera actions` },
                            React.createElement(KebabMenuItem, { onClick: async () => {
                                    const command = `spec_goto ${camera.x} ${camera.y} ${camera.z} ${camera.pitch} ${camera.yaw}`;
                                    await navigator.clipboard.writeText(command);
                                    showToast({
                                        type: 'success',
                                        content: React.createElement(Trans, null, "spec_goto command copied to clipboard"),
                                    });
                                } },
                                React.createElement(Trans, null, "Copy spec_goto command")))))))));
}
//# sourceMappingURL=camera-entry.js.map