import React, { useState } from 'react';
import { useLingui } from '@lingui/react/macro';
import { RendererClientMessageName } from 'csdm/server/renderer-client-message-name';
import { useWebSocketClient } from 'csdm/ui/hooks/use-web-socket-client';
import { Checkbox } from 'csdm/ui/components/inputs/checkbox';
import { SheetName } from 'csdm/node/xlsx/sheet-name';
import { ExportingToXlsxDialog } from './exporting-to-xlsx-dialog';
import { sheetTranslations } from 'csdm/ui/xlsx/xlsx-sheet-translations';
import { ExportXlsxOptionsDialog } from './export-xlsx-options-dialog';
export function ExportMatchesAsXlsxDialog({ matches }) {
    const { t } = useLingui();
    const client = useWebSocketClient();
    const [isExporting, setIsExporting] = useState(false);
    const checksums = matches.map((match) => match.checksum);
    if (isExporting) {
        return React.createElement(ExportingToXlsxDialog, { totalCount: matches.length });
    }
    return (React.createElement(ExportXlsxOptionsDialog, { ids: checksums, renderCheckboxes: (isExportIntoSingleFile) => {
            return (React.createElement(React.Fragment, null,
                React.createElement(Checkbox, { label: t(sheetTranslations[SheetName.General]), name: "sheets.general", defaultChecked: true }),
                React.createElement(Checkbox, { label: t(sheetTranslations[SheetName.Rounds]), name: "sheets.rounds", defaultChecked: true }),
                React.createElement(Checkbox, { label: t(sheetTranslations[SheetName.Players]), name: "sheets.players", defaultChecked: true }),
                React.createElement(Checkbox, { label: t(sheetTranslations[SheetName.Kills]), name: "sheets.kills", defaultChecked: true }),
                React.createElement(Checkbox, { label: t(sheetTranslations[SheetName.Weapons]), name: "sheets.weapons", defaultChecked: true }),
                React.createElement(Checkbox, { label: t(sheetTranslations[SheetName.Clutches]), name: "sheets.clutches", defaultChecked: true }),
                isExportIntoSingleFile && (React.createElement(Checkbox, { label: t(sheetTranslations[SheetName.PlayersFlashbangMatrix]), name: "sheets.playersFlashbangMatrix", defaultChecked: true }))));
        }, onOutputSelected: (type, outputPath, formData) => {
            const commonPayload = {
                sheets: {
                    [SheetName.General]: formData.has('sheets.general'),
                    [SheetName.Players]: formData.has('sheets.players'),
                    [SheetName.Kills]: formData.has('sheets.kills'),
                    [SheetName.Rounds]: formData.has('sheets.rounds'),
                    [SheetName.Weapons]: formData.has('sheets.weapons'),
                    [SheetName.Clutches]: formData.has('sheets.clutches'),
                    [SheetName.PlayersFlashbangMatrix]: formData.has('sheets.playersFlashbangMatrix'),
                },
            };
            let payload;
            if (type === 'file') {
                payload = {
                    ...commonPayload,
                    exportEachMatchToSingleFile: false,
                    outputFilePath: outputPath,
                    checksums,
                };
            }
            else {
                payload = {
                    ...commonPayload,
                    exportEachMatchToSingleFile: true,
                    outputFolderPath: outputPath,
                    matches,
                };
            }
            client.send({
                name: RendererClientMessageName.ExportMatchesToXlsx,
                payload,
            });
            setIsExporting(true);
        } }));
}
//# sourceMappingURL=export-matches-xlsx-dialog.js.map