import { sql } from 'kysely';
export async function resetDatabase(transaction) {
    await sql `DROP SCHEMA public CASCADE`.execute(transaction);
    await sql `CREATE SCHEMA public`.execute(transaction);
    await sql `GRANT ALL ON SCHEMA public TO public`.execute(transaction);
}
//# sourceMappingURL=reset-database.js.map