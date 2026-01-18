import { db } from 'csdm/node/database/database';
export async function deleteDemos(checksums) {
    await db.transaction().execute(async (transaction) => {
        let demosQuery = transaction.deleteFrom('demos');
        if (checksums) {
            demosQuery = demosQuery.where('checksum', 'in', checksums);
        }
        let demoPathsQuery = transaction.deleteFrom('demo_paths');
        if (checksums) {
            demoPathsQuery = demoPathsQuery.where('checksum', 'in', checksums);
        }
        await Promise.all([demosQuery.execute(), demoPathsQuery.execute()]);
    });
}
//# sourceMappingURL=delete-demos.js.map