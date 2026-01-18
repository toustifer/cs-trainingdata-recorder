import { db } from 'csdm/node/database/database';
export async function updateCurrentFaceitAccount(accountId) {
    await db.transaction().execute(async (transaction) => {
        await transaction
            .updateTable('faceit_accounts')
            .set({
            is_current: false,
        })
            .where('id', '<>', accountId)
            .execute();
        await transaction
            .updateTable('faceit_accounts')
            .set({
            is_current: true,
        })
            .where('id', '=', accountId)
            .execute();
    });
}
//# sourceMappingURL=update-current-faceit-account.js.map