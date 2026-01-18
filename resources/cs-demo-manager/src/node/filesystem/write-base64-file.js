import fs from 'fs-extra';
export async function writeBase64File(filePath, data) {
    await fs.writeFile(filePath, data, 'base64');
}
//# sourceMappingURL=write-base64-file.js.map