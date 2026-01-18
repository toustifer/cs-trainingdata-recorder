import { db } from 'csdm/node/database/database';
export async function updateCamera(camera) {
    const updatedCamera = await db
        .updateTable('cameras')
        .set(camera)
        .where('id', '=', camera.id)
        .returningAll()
        .executeTakeFirstOrThrow();
    return updatedCamera;
}
//# sourceMappingURL=update-camera.js.map