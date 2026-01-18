import { db } from 'csdm/node/database/database';
import { faceitAccountRowToFaceitAccount } from './faceit-account-row-to-faceit-account';
export async function fetchFaceitAccounts() {
    const rows = await db.selectFrom('faceit_accounts').selectAll().orderBy('nickname').execute();
    const accounts = rows.map(faceitAccountRowToFaceitAccount);
    return accounts;
}
//# sourceMappingURL=fetch-faceit-accounts.js.map