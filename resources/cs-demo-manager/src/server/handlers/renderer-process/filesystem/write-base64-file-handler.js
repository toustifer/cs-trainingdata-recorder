import { writeBase64File } from 'csdm/node/filesystem/write-base64-file';
export async function writeBase64FileHandler({ filePath, data }) {
    await writeBase64File(filePath, data);
}
//# sourceMappingURL=write-base64-file-handler.js.map