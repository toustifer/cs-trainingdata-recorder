import React from 'react';
import { Trans } from '@lingui/react/macro';
import { Button } from 'csdm/ui/components/buttons/button';
import { DeleteMapDialog } from './delete-map-dialog';
import { EditMapDialog } from './edit-map-dialog';
import { DeleteButton } from 'csdm/ui/components/buttons/delete-button';
import { useDialog } from 'csdm/ui/components/dialogs/use-dialog';
import { MapFormProvider } from 'csdm/ui/settings/maps/map-dialog/map-form-provider';
import { useGetMapThumbnailSrc } from 'csdm/ui/maps/use-get-map-thumbnail-src';
export function MapEntry({ map }) {
    const getMapThumbnailSrc = useGetMapThumbnailSrc();
    const { showDialog } = useDialog();
    return (React.createElement("div", { className: "w-[256px] rounded border border-gray-300" },
        React.createElement("img", { src: getMapThumbnailSrc(map.name, map.game), alt: map.name }),
        React.createElement("div", { className: "p-8" },
            React.createElement("p", null, map.name),
            React.createElement("div", { className: "mt-8 flex gap-8" },
                React.createElement(Button, { onClick: async () => {
                        const [radarBase64, lowerRadarBase64, thumbnailBase64] = await Promise.all([
                            window.csdm.getMapRadarBase64(map.name, map.game),
                            window.csdm.getMapLowerRadarBase64(map.name, map.game),
                            window.csdm.getMapThumbnailBase64(map.name, map.game),
                        ]);
                        const initialValues = {
                            name: map.name,
                            posX: String(map.posX),
                            posY: String(map.posY),
                            thresholdZ: String(map.thresholdZ),
                            scale: String(map.scale),
                            radarBase64,
                            lowerRadarBase64,
                            thumbnailBase64,
                        };
                        showDialog(React.createElement(MapFormProvider, { id: map.id, game: map.game, initialValues: initialValues },
                            React.createElement(EditMapDialog, null)));
                    } },
                    React.createElement(Trans, { context: "Button" }, "Edit")),
                React.createElement(DeleteButton, { onClick: () => {
                        showDialog(React.createElement(DeleteMapDialog, { map: map }));
                    } })))));
}
//# sourceMappingURL=map-entry.js.map