export async function insertDefaultTags(db) {
    const defaultTags = [
        {
            name: 'To watch',
            color: '#f29423',
        },
        {
            name: 'Watched',
            color: '#33ab84',
        },
    ];
    await db
        .insertInto('tags')
        .values(defaultTags)
        .onConflict((oc) => oc.column('name').doNothing())
        .execute();
}
//# sourceMappingURL=insert-default-tags.js.map