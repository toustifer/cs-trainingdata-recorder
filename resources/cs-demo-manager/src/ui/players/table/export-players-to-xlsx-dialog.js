import React, { useState } from 'react';
import { useLingui } from '@lingui/react/macro';
import { RendererClientMessageName } from 'csdm/server/renderer-client-message-name';
import { useWebSocketClient } from 'csdm/ui/hooks/use-web-socket-client';
import { Checkbox } from 'csdm/ui/components/inputs/checkbox';
import { PlayerSheetName } from 'csdm/node/xlsx/player-sheet-name';
import { ExportingToXlsxDialog } from 'csdm/ui/components/dialogs/exporting-to-xlsx-dialog';
import { sheetTranslations } from 'csdm/ui/xlsx/xlsx-sheet-translations';
import { ExportXlsxOptionsDialog } from 'csdm/ui/components/dialogs/export-xlsx-options-dialog';
export function ExportPlayersToXlsxDialog({ steamIds, filters }) {
    const [isExporting, setIsExporting] = useState(false);
    const { t } = useLingui();
    const client = useWebSocketClient();
    if (isExporting) {
        return React.createElement(ExportingToXlsxDialog, { totalCount: steamIds.length });
    }
    return (React.createElement(ExportXlsxOptionsDialog, { ids: steamIds, renderCheckboxes: (isExportIntoSingleFile) => {
            if (isExportIntoSingleFile) {
                return (React.createElement(React.Fragment, null,
                    React.createElement(Checkbox, { label: t(sheetTranslations[PlayerSheetName.General]), name: "sheets.general", defaultChecked: true }),
                    React.createElement(Checkbox, { label: t(sheetTranslations[PlayerSheetName.Maps]), name: "sheets.maps", defaultChecked: true }),
                    React.createElement(Checkbox, { label: t(sheetTranslations[PlayerSheetName.Clutch]), name: "sheets.clutch", defaultChecked: true }),
                    React.createElement(Checkbox, { label: t(sheetTranslations[PlayerSheetName.Utility]), name: "sheets.utility", defaultChecked: true }),
                    React.createElement(Checkbox, { label: t(sheetTranslations[PlayerSheetName.Economy]), name: "sheets.economy", defaultChecked: true })));
            }
            return (React.createElement(React.Fragment, null,
                React.createElement(Checkbox, { label: t(sheetTranslations[PlayerSheetName.Players]), name: "sheets.players", defaultChecked: true }),
                React.createElement(Checkbox, { label: t(sheetTranslations[PlayerSheetName.Maps]), name: "sheets.maps", defaultChecked: true }),
                React.createElement(Checkbox, { label: t(sheetTranslations[PlayerSheetName.Rounds]), name: "sheets.rounds", defaultChecked: true }),
                React.createElement(Checkbox, { label: t(sheetTranslations[PlayerSheetName.Clutch]), name: "sheets.clutch", defaultChecked: true }),
                React.createElement(Checkbox, { label: t(sheetTranslations[PlayerSheetName.Utility]), name: "sheets.utility", defaultChecked: true }),
                React.createElement(Checkbox, { label: t(sheetTranslations[PlayerSheetName.Economy]), name: "sheets.economy", defaultChecked: true })));
        }, onOutputSelected: (type, outputPath, formData) => {
            const commonPayload = {
                steamIds,
                sheets: {
                    [PlayerSheetName.General]: formData.has('sheets.general'),
                    [PlayerSheetName.Players]: formData.has('sheets.players'),
                    [PlayerSheetName.Maps]: formData.has('sheets.maps'),
                    [PlayerSheetName.Rounds]: formData.has('sheets.rounds'),
                    [PlayerSheetName.Clutch]: formData.has('sheets.clutch'),
                    [PlayerSheetName.Utility]: formData.has('sheets.utility'),
                    [PlayerSheetName.Economy]: formData.has('sheets.economy'),
                },
            };
            let payload;
            if (type === 'file') {
                payload = {
                    ...commonPayload,
                    exportEachPlayerToSingleFile: false,
                    outputFilePath: outputPath,
                };
            }
            else {
                payload = {
                    ...commonPayload,
                    exportEachPlayerToSingleFile: true,
                    outputFolderPath: outputPath,
                    filters,
                };
            }
            client.send({
                name: RendererClientMessageName.ExportPlayersToXlsx,
                payload,
            });
            setIsExporting(true);
        } }));
}
//# sourceMappingURL=export-players-to-xlsx-dialog.js.map