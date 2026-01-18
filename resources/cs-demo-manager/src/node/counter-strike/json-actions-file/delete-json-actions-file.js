import fs from 'fs-extra';
export async function deleteJsonActionsFile(demoPath) {
    await fs.remove(`${demoPath}.json`);
}
//# sourceMappingURL=delete-json-actions-file.js.map