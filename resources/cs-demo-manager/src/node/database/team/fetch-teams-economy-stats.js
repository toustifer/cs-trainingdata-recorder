import { sql } from 'kysely';
import { EconomyType, TeamLetter, TeamNumber } from 'csdm/common/types/counter-strike';
import { db } from '../database';
import { applyMatchFilters } from '../match/apply-match-filters';
export async function fetchTeamsEconomyStats({ matchChecksum, teamName }, filters) {
    const teamsQuery = db.with('team_data', (db) => {
        let query = db
            .selectFrom('teams')
            .leftJoin('rounds', 'rounds.match_checksum', 'teams.match_checksum')
            .leftJoin('matches', 'matches.checksum', 'teams.match_checksum')
            .select((eb) => [
            'teams.name',
            'rounds.winner_name',
            eb
                .case()
                .when('teams.letter', '=', TeamLetter.A)
                .then(eb.ref('rounds.team_a_economy_type'))
                .when('teams.letter', '=', TeamLetter.B)
                .then(eb.ref('rounds.team_b_economy_type'))
                .end()
                .as('economy_type'),
            eb
                .case()
                .when('teams.letter', '=', TeamLetter.A)
                .then(eb.ref('rounds.team_a_side'))
                .when('teams.letter', '=', TeamLetter.B)
                .then(eb.ref('rounds.team_b_side'))
                .end()
                .as('side'),
        ]);
        if (matchChecksum) {
            query = query.where('teams.match_checksum', '=', matchChecksum);
        }
        else if (teamName) {
            query = query.where('teams.name', '=', teamName);
        }
        if (filters) {
            query = applyMatchFilters(query, filters);
        }
        return query;
    });
    const rows = await teamsQuery
        .selectFrom('team_data')
        .select((eb) => {
        return [
            'name as teamName',
            // Pistol stats
            eb.fn.count(eb.case().when('economy_type', '=', EconomyType.Pistol).then(1).end()).as('pistolCount'),
            sql `COUNT(CASE WHEN economy_type = ${EconomyType.Pistol} AND winner_name = team_data.name THEN 1 END)`.as('pistolWonCount'),
            sql `COUNT(CASE WHEN economy_type = ${EconomyType.Pistol} AND winner_name != team_data.name THEN 1 END)`.as('pistolLostCount'),
            sql `COUNT(CASE WHEN economy_type = ${EconomyType.Pistol} AND winner_name = team_data.name AND side = ${TeamNumber.CT} THEN 1 END)`.as('pistolWonAsCtCount'),
            sql `COUNT(CASE WHEN economy_type = ${EconomyType.Pistol} AND winner_name != team_data.name AND side = ${TeamNumber.CT} THEN 1 END)`.as('pistolLostAsCtCount'),
            sql `COUNT(CASE WHEN economy_type = ${EconomyType.Pistol} AND winner_name = team_data.name AND side = ${TeamNumber.T} THEN 1 END)`.as('pistolWonAsTCount'),
            sql `COUNT(CASE WHEN economy_type = ${EconomyType.Pistol} AND winner_name != team_data.name AND side = ${TeamNumber.T} THEN 1 END)`.as('pistolLostAsTCount'),
            // Eco stats
            eb.fn.count(eb.case().when('economy_type', '=', EconomyType.Eco).then(1).end()).as('ecoCount'),
            sql `COUNT(CASE WHEN economy_type = ${EconomyType.Eco} AND winner_name = team_data.name THEN 1 END)`.as('ecoWonCount'),
            sql `COUNT(CASE WHEN economy_type = ${EconomyType.Eco} AND winner_name != team_data.name THEN 1 END)`.as('ecoLostCount'),
            sql `COUNT(CASE WHEN economy_type = ${EconomyType.Eco} AND winner_name = team_data.name AND side = ${TeamNumber.CT} THEN 1 END)`.as('ecoWonAsCtCount'),
            sql `COUNT(CASE WHEN economy_type = ${EconomyType.Eco} AND winner_name != team_data.name AND side = ${TeamNumber.CT} THEN 1 END)`.as('ecoLostAsCtCount'),
            sql `COUNT(CASE WHEN economy_type = ${EconomyType.Eco} AND winner_name = team_data.name AND side = ${TeamNumber.T} THEN 1 END)`.as('ecoWonAsTCount'),
            sql `COUNT(CASE WHEN economy_type = ${EconomyType.Eco} AND winner_name != team_data.name AND side = ${TeamNumber.T} THEN 1 END)`.as('ecoLostAsTCount'),
            // Semi stats
            eb.fn.count(eb.case().when('economy_type', '=', EconomyType.Semi).then(1).end()).as('semiCount'),
            sql `COUNT(CASE WHEN economy_type = ${EconomyType.Semi} AND winner_name = team_data.name THEN 1 END)`.as('semiWonCount'),
            sql `COUNT(CASE WHEN economy_type = ${EconomyType.Semi} AND winner_name != team_data.name THEN 1 END)`.as('semiLostCount'),
            sql `COUNT(CASE WHEN economy_type = ${EconomyType.Semi} AND winner_name = team_data.name AND side = ${TeamNumber.CT} THEN 1 END)`.as('semiWonAsCtCount'),
            sql `COUNT(CASE WHEN economy_type = ${EconomyType.Semi} AND winner_name != team_data.name AND side = ${TeamNumber.CT} THEN 1 END)`.as('semiLostAsCtCount'),
            sql `COUNT(CASE WHEN economy_type = ${EconomyType.Semi} AND winner_name = team_data.name AND side = ${TeamNumber.T} THEN 1 END)`.as('semiWonAsTCount'),
            sql `COUNT(CASE WHEN economy_type = ${EconomyType.Semi} AND winner_name != team_data.name AND side = ${TeamNumber.T} THEN 1 END)`.as('semiLostAsTCount'),
            // ForceBuy stats
            eb.fn
                .count(eb.case().when('economy_type', '=', EconomyType.ForceBuy).then(1).end())
                .as('forceBuyCount'),
            sql `COUNT(CASE WHEN economy_type = ${EconomyType.ForceBuy} AND winner_name = team_data.name THEN 1 END)`.as('forceBuyWonCount'),
            sql `COUNT(CASE WHEN economy_type = ${EconomyType.ForceBuy} AND winner_name != team_data.name THEN 1 END)`.as('forceBuyLostCount'),
            sql `COUNT(CASE WHEN economy_type = ${EconomyType.ForceBuy} AND winner_name = team_data.name AND side = ${TeamNumber.CT} THEN 1 END)`.as('forceBuyWonAsCtCount'),
            sql `COUNT(CASE WHEN economy_type = ${EconomyType.ForceBuy} AND winner_name != team_data.name AND side = ${TeamNumber.CT} THEN 1 END)`.as('forceBuyLostAsCtCount'),
            sql `COUNT(CASE WHEN economy_type = ${EconomyType.ForceBuy} AND winner_name = team_data.name AND side = ${TeamNumber.T} THEN 1 END)`.as('forceBuyWonAsTCount'),
            sql `COUNT(CASE WHEN economy_type = ${EconomyType.ForceBuy} AND winner_name != team_data.name AND side = ${TeamNumber.T} THEN 1 END)`.as('forceBuyLostAsTCount'),
            // Full buy stats
            eb.fn.count(eb.case().when('economy_type', '=', EconomyType.Full).then(1).end()).as('fullCount'),
            sql `COUNT(CASE WHEN economy_type = ${EconomyType.Full} AND winner_name = team_data.name THEN 1 END)`.as('fullWonCount'),
            sql `COUNT(CASE WHEN economy_type = ${EconomyType.Full} AND winner_name != team_data.name THEN 1 END)`.as('fullLostCount'),
            sql `COUNT(CASE WHEN economy_type = ${EconomyType.Full} AND winner_name = team_data.name AND side = ${TeamNumber.CT} THEN 1 END)`.as('fullWonAsCtCount'),
            sql `COUNT(CASE WHEN economy_type = ${EconomyType.Full} AND winner_name != team_data.name AND side = ${TeamNumber.CT} THEN 1 END)`.as('fullLostAsCtCount'),
            sql `COUNT(CASE WHEN economy_type = ${EconomyType.Full} AND winner_name = team_data.name AND side = ${TeamNumber.T} THEN 1 END)`.as('fullWonAsTCount'),
            sql `COUNT(CASE WHEN economy_type = ${EconomyType.Full} AND winner_name != team_data.name AND side = ${TeamNumber.T} THEN 1 END)`.as('fullLostAsTCount'),
        ];
    })
        .groupBy('name')
        .execute();
    return rows;
}
//# sourceMappingURL=fetch-teams-economy-stats.js.map