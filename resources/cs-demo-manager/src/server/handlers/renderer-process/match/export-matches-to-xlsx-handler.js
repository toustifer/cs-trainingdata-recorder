import { MatchesXlsxExport } from 'csdm/node/xlsx/matches-xlsx-export';
import { RendererServerMessageName } from 'csdm/server/renderer-server-message-name';
import { server } from 'csdm/server/server';
import { MatchXlsxExport } from 'csdm/node/xlsx/match-xlsx-export';
export async function exportMatchesToXlsxHandler(payload) {
    try {
        if (payload.exportEachMatchToSingleFile) {
            for (const [index, match] of payload.matches.entries()) {
                server.sendMessageToRendererProcess({
                    name: RendererServerMessageName.ExportToXlsxProgress,
                    payload: {
                        count: index + 1,
                        totalCount: payload.matches.length,
                    },
                });
                const outputFilePath = `${payload.outputFolderPath}/${match.name}.xlsx`;
                const xlsxExport = new MatchXlsxExport({
                    checksum: match.checksum,
                    outputFilePath,
                    sheets: payload.sheets,
                });
                await xlsxExport.generate();
            }
        }
        else {
            const xlsxExport = new MatchesXlsxExport({
                checksums: payload.checksums,
                outputFilePath: payload.outputFilePath,
                sheets: payload.sheets,
                onSheetGenerationStart(sheetName) {
                    server.sendMessageToRendererProcess({
                        name: RendererServerMessageName.ExportToXlsxSheetProgress,
                        payload: sheetName,
                    });
                },
            });
            await xlsxExport.generate();
        }
        const successPayload = payload.exportEachMatchToSingleFile
            ? {
                outputType: 'folder',
                outputPath: payload.outputFolderPath,
            }
            : {
                outputType: 'file',
                outputPath: payload.outputFilePath,
            };
        server.sendMessageToRendererProcess({
            name: RendererServerMessageName.ExportToXlsxSuccess,
            payload: successPayload,
        });
    }
    catch (error) {
        logger.error('Error while exporting matches to XLSX');
        logger.error(error);
        server.sendMessageToRendererProcess({
            name: RendererServerMessageName.ExportToXlsxError,
        });
    }
}
//# sourceMappingURL=export-matches-to-xlsx-handler.js.map