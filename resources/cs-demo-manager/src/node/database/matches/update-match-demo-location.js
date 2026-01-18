import { db } from 'csdm/node/database/database';
export async function updateMatchDemoLocation(checksum, demoPath) {
    const sanitizedDemoPath = demoPath.replaceAll('\\', '/');
    await db
        .updateTable('matches')
        .set({
        demo_path: sanitizedDemoPath,
    })
        .where('checksum', '=', checksum)
        .execute();
}
//# sourceMappingURL=update-match-demo-location.js.map