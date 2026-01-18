import { db } from 'csdm/node/database/database';
import { fiveEPlayAccountRowTo5EPlayAccount } from './5eplay-account-row-to-5eplay-account';
export async function fetch5EPlayAccounts() {
    const rows = await db.selectFrom('5eplay_accounts').selectAll().orderBy('nickname').execute();
    const accounts = rows.map(fiveEPlayAccountRowTo5EPlayAccount);
    return accounts;
}
//# sourceMappingURL=fetch-5eplay-accounts.js.map