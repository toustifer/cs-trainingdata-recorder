import { db } from 'csdm/node/database/database';
export async function searchMapNames({ name, ignoredNames }) {
    const query = db
        .selectFrom('matches')
        .select(['matches.map_name'])
        .distinctOn(['matches.map_name'])
        .where(({ eb, or, and }) => {
        const filters = [or([eb('matches.map_name', 'ilike', `%${name}%`)])];
        if (ignoredNames.length > 0) {
            filters.push(eb('matches.map_name', 'not in', ignoredNames));
        }
        return and(filters);
    })
        .limit(20);
    const rows = await query.execute();
    const maps = rows.map((row) => {
        return row.map_name;
    });
    return maps;
}
//# sourceMappingURL=search-map-names.js.map