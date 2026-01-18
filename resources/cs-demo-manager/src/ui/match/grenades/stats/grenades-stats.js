import React, { useState } from 'react';
import { useCurrentMatch } from 'csdm/ui/match/use-current-match';
import { GrenadeOption } from 'csdm/ui/match/grenades/stats/grenade-option';
import { PlayersStatsGrid } from 'csdm/ui/match/grenades/stats/players-stats-grid';
import { GrenadeSelect } from 'csdm/ui/match/grenades/stats/grenade-select';
import { StatsLabel } from 'csdm/ui/match/grenades/stats/stats-label';
import { Panel } from 'csdm/ui/components/panel';
import { Content } from 'csdm/ui/components/content';
import { PlayersFlashbangMatrix } from 'csdm/ui/match/grenades/stats/players-flashbang-matrix';
export function GrenadesStats() {
    const match = useCurrentMatch();
    const [filters, setFilters] = useState({
        grenade: GrenadeOption.Flashbang,
    });
    const playersTeamA = match.players.filter((player) => {
        return player.teamName === match.teamA.name;
    });
    const playersTeamB = match.players.filter((player) => {
        return player.teamName === match.teamB.name;
    });
    return (React.createElement(Content, null,
        React.createElement("div", { className: "flex flex-col gap-y-12" },
            React.createElement(Panel, { header: React.createElement("div", null,
                    React.createElement(GrenadeSelect, { selectedGrenade: filters.grenade, onChange: (grenade) => {
                            setFilters({
                                ...filters,
                                grenade,
                            });
                        } })) },
                React.createElement("div", { className: "grid self-start" },
                    React.createElement(PlayersStatsGrid, { grenade: filters.grenade, players: playersTeamA, teamName: match.teamA.name }),
                    React.createElement(StatsLabel, { grenade: filters.grenade }),
                    React.createElement("div", null),
                    React.createElement(PlayersStatsGrid, { grenade: filters.grenade, players: playersTeamB, teamName: match.teamB.name }))),
            React.createElement(PlayersFlashbangMatrix, null))));
}
//# sourceMappingURL=grenades-stats.js.map