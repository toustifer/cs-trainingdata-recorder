import { deleteDemos } from 'csdm/node/demo/delete-demos';
export async function deleteDemosHandler(demos) {
    const { deletedDemos, notDeletedDemos } = await deleteDemos(demos);
    const payload = {
        deletedDemos,
        notDeletedDemos,
    };
    return payload;
}
//# sourceMappingURL=delete-demos-handler.js.map