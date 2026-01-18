import React from 'react';
import { Trans } from '@lingui/react/macro';
import { GrenadeName, EconomyType } from 'csdm/common/types/counter-strike';
import { useCurrentRound } from './use-current-round';
import { useCurrentMatch } from 'csdm/ui/match/use-current-match';
import { Avatar } from 'csdm/ui/components/avatar';
import { roundNumber } from 'csdm/common/math/round-number';
import { useFormatMoney } from 'csdm/ui/hooks/use-format-money';
import { useTranslateEconomyType } from 'csdm/ui/match/economy/team-economy-breakdown/use-translate-economy-type';
function MainGrid({ children }) {
    return (React.createElement("div", { className: "grid grid-cols-[1fr_auto_1fr]", style: {
            gridTemplateAreas: `
          'header-left header-middle header-right'
          'gameplay-title-left gameplay-title gameplay-title-right'
          'gameplay-team-a gameplay-types gameplay-team-b'
          'kills-title-left kills-title kills-title-right'
          'kills-team-a kills-types kills-team-b'
          'deaths-title-left deaths-title deaths-title-right'
          'deaths-team-a deaths-types deaths-team-b'
          'grenades-title-left grenades-title grenades-title-right'
          'grenades-team-a grenades-types grenades-team-b'
          'damages-title-left damages-title damages-title-right'
          'damages-team-a damages-types damages-team-b'
          'economy-title-left economy-title economy-title-right'
          'economy-team-a economy-types economy-team-b'
        `,
        } }, children));
}
function Grid({ children, area, playerCount }) {
    return (React.createElement("div", { className: "grid", style: {
            gridTemplateColumns: `repeat(${playerCount}, 1fr)`,
            gridArea: area,
        } }, children));
}
function GridRows({ children }) {
    return React.createElement("div", { className: "grid border-r border-r-gray-300 last:border-r-0" }, children);
}
function Middle({ children, area }) {
    return (React.createElement("div", { className: "mx-8 flex h-full flex-col items-center justify-center", style: {
            gridArea: area,
        } }, children));
}
function StickyHeader({ children, style }) {
    return (React.createElement("div", { className: "sticky -top-16 grid bg-gray-75 py-4", style: style }, children));
}
function Players({ children, playerCount }) {
    return (React.createElement(StickyHeader, { style: {
            gridTemplateColumns: `repeat(${playerCount}, 1fr)`,
        } }, children));
}
function Title({ children }) {
    return (React.createElement("div", { className: "flex h-[50px] w-full items-center justify-center" },
        React.createElement("p", null, children)));
}
function PlayerAvatar({ player }) {
    return (React.createElement("div", { className: "flex flex-col items-center" },
        React.createElement(Avatar, { avatarUrl: player.avatar, size: 40 }),
        React.createElement("p", { className: "max-w-[100px] selectable truncate" }, player.name)));
}
function Cell({ value }) {
    return (React.createElement("div", { className: "flex items-center justify-center border-b border-b-gray-300 bg-gray-100 last:border-b-0" },
        React.createElement("p", { className: "selectable" }, value)));
}
function Gameplay({ round, roundKills, playersTeamA, playersTeamB }) {
    const match = useCurrentMatch();
    const renderGameplayGrid = (players, gridArea) => {
        return (React.createElement(Grid, { area: gridArea, playerCount: players.length }, players.map((player) => {
            const playerDeath = roundKills.find((kill) => {
                return kill.victimSteamId === player.steamId;
            });
            const deathTick = playerDeath?.tick ?? round.endOfficiallyTick;
            const timeAlive = roundNumber((deathTick - round.freezetimeEndTick) / match.tickrate);
            return (React.createElement(GridRows, { key: player.steamId },
                React.createElement(Cell, { value: `${timeAlive}s` })));
        })));
    };
    return (React.createElement(React.Fragment, null,
        React.createElement(Middle, { area: "gameplay-title" },
            React.createElement(Title, null,
                React.createElement(Trans, null, "Gameplay"))),
        renderGameplayGrid(playersTeamA, 'gameplay-team-a'),
        React.createElement(Middle, { area: "gameplay-types" },
            React.createElement(Title, null,
                React.createElement(Trans, null, "Time alive"))),
        renderGameplayGrid(playersTeamB, 'gameplay-team-b')));
}
function Kills({ roundKills, roundChickenDeaths, playersTeamA, playersTeamB }) {
    const renderKillsGrid = (players, gridArea) => {
        return (React.createElement(Grid, { area: gridArea, playerCount: players.length }, players.map((player) => {
            const kills = roundKills.filter((kill) => kill.killerSteamId === player.steamId);
            const airborneKillCount = kills.filter((kill) => kill.isKillerAirborne).length;
            const blindedKillCount = kills.filter((kill) => kill.isKillerBlinded).length;
            const tradeKillCount = kills.filter((kill) => kill.isTradeKill).length;
            const headshotKillCount = kills.filter((kill) => kill.isHeadshot).length;
            const chickenKillCount = roundChickenDeaths.filter((death) => death.killerSteamId === player.steamId).length;
            return (React.createElement(GridRows, { key: player.steamId },
                React.createElement(Cell, { value: kills.length }),
                React.createElement(Cell, { value: headshotKillCount }),
                React.createElement(Cell, { value: tradeKillCount }),
                React.createElement(Cell, { value: airborneKillCount }),
                React.createElement(Cell, { value: blindedKillCount }),
                React.createElement(Cell, { value: chickenKillCount })));
        })));
    };
    return (React.createElement(React.Fragment, null,
        React.createElement(Middle, { area: "kills-title" },
            React.createElement(Title, null,
                React.createElement(Trans, null, "Kills"))),
        renderKillsGrid(playersTeamA, 'kills-team-a'),
        React.createElement(Middle, { area: "kills-types" },
            React.createElement(Title, null,
                React.createElement(Trans, null, "Kills")),
            React.createElement(Title, null,
                React.createElement(Trans, null, "Headshot kills")),
            React.createElement(Title, null,
                React.createElement(Trans, null, "Trade kills")),
            React.createElement(Title, null,
                React.createElement(Trans, null, "Airborne kills")),
            React.createElement(Title, null,
                React.createElement(Trans, null, "Blinded kills")),
            React.createElement(Title, null,
                React.createElement(Trans, null, "Chicken kills"))),
        renderKillsGrid(playersTeamB, 'kills-team-b')));
}
function Deaths({ roundKills, playersTeamA, playersTeamB }) {
    const renderDeathsGrid = (players, gridArea) => {
        return (React.createElement(Grid, { area: gridArea, playerCount: players.length }, players.map((player) => {
            const deaths = roundKills.filter((kill) => kill.victimSteamId === player.steamId);
            const tradeDeathCount = deaths.filter((kill) => kill.isTradeDeath).length;
            const blindedDeathCount = deaths.filter((kill) => kill.isVictimBlinded).length;
            return (React.createElement(GridRows, { key: player.steamId },
                React.createElement(Cell, { value: deaths.length }),
                React.createElement(Cell, { value: tradeDeathCount }),
                React.createElement(Cell, { value: blindedDeathCount })));
        })));
    };
    return (React.createElement(React.Fragment, null,
        React.createElement(Middle, { area: "deaths-title" },
            React.createElement(Title, null,
                React.createElement(Trans, null, "Deaths"))),
        renderDeathsGrid(playersTeamA, 'deaths-team-a'),
        React.createElement(Middle, { area: "deaths-types" },
            React.createElement(Title, null,
                React.createElement(Trans, null, "Deaths")),
            React.createElement(Title, null,
                React.createElement(Trans, null, "Trade deaths")),
            React.createElement(Title, null,
                React.createElement(Trans, null, "Blinded deaths"))),
        renderDeathsGrid(playersTeamB, 'deaths-team-b')));
}
function Grenades({ roundShots, playersTeamA, playersTeamB }) {
    const renderGrenadesGrid = (players, gridArea) => {
        return (React.createElement(Grid, { area: gridArea, playerCount: players.length }, players.map((player) => {
            const playerShots = roundShots.filter((shot) => {
                return shot.playerSteamId === player.steamId;
            });
            const flashbangCount = playerShots.filter((shot) => shot.weaponName === GrenadeName.Flashbang).length;
            const heCount = playerShots.filter((shot) => shot.weaponName === GrenadeName.HE).length;
            const smokeCount = playerShots.filter((shot) => shot.weaponName === GrenadeName.Smoke).length;
            const decoyCount = playerShots.filter((shot) => shot.weaponName === GrenadeName.Decoy).length;
            const fireGrenadeCount = playerShots.filter((shot) => {
                return shot.weaponName === GrenadeName.Incendiary || shot.weaponName === GrenadeName.Molotov;
            }).length;
            return (React.createElement(GridRows, { key: player.steamId },
                React.createElement(Cell, { value: flashbangCount }),
                React.createElement(Cell, { value: heCount }),
                React.createElement(Cell, { value: smokeCount }),
                React.createElement(Cell, { value: decoyCount }),
                React.createElement(Cell, { value: fireGrenadeCount })));
        })));
    };
    return (React.createElement(React.Fragment, null,
        React.createElement(Middle, { area: "grenades-title" },
            React.createElement(Title, null,
                React.createElement(Trans, null, "Grenades"))),
        renderGrenadesGrid(playersTeamA, 'grenades-team-a'),
        React.createElement(Middle, { area: "grenades-types" },
            React.createElement(Title, null,
                React.createElement(Trans, null, "Flash")),
            React.createElement(Title, null,
                React.createElement(Trans, null, "HE")),
            React.createElement(Title, null,
                React.createElement(Trans, null, "Smoke")),
            React.createElement(Title, null,
                React.createElement(Trans, null, "Decoy")),
            React.createElement(Title, null,
                React.createElement(Trans, null, "Molotov"))),
        renderGrenadesGrid(playersTeamB, 'grenades-team-b')));
}
function Damages({ roundShots, roundDamages, playersTeamA, playersTeamB }) {
    const renderDamagesGrid = (players, gridArea) => {
        return (React.createElement(Grid, { area: gridArea, playerCount: players.length }, players.map((player) => {
            const weaponShotCount = roundShots.filter((shot) => {
                return shot.playerSteamId === player.steamId;
            }).length;
            const playerDamages = roundDamages.filter((damage) => {
                return damage.attackerSteamId === player.steamId;
            });
            const damageDealt = playerDamages.reduce((previousHealthDamage, { healthDamage }) => {
                return previousHealthDamage + healthDamage;
            }, 0);
            const ownDamage = playerDamages
                .filter((damage) => {
                return damage.victimSteamId === player.steamId;
            })
                .reduce((previousHealthDamage, { healthDamage }) => {
                return previousHealthDamage + healthDamage;
            }, 0);
            const ownTeamDamage = playerDamages
                .filter((damage) => {
                return damage.victimTeamName === player.teamName;
            })
                .reduce((previousHealthDamage, { healthDamage }) => {
                return previousHealthDamage + healthDamage;
            }, 0);
            const opponentHurtSteamIds = [];
            for (const damage of playerDamages) {
                if (damage.victimSteamId !== player.steamId &&
                    damage.victimTeamName !== player.teamName &&
                    !opponentHurtSteamIds.includes(damage.victimSteamId)) {
                    opponentHurtSteamIds.push(damage.victimSteamId);
                }
            }
            return (React.createElement(GridRows, { key: player.steamId },
                React.createElement(Cell, { value: weaponShotCount }),
                React.createElement(Cell, { value: damageDealt }),
                React.createElement(Cell, { value: opponentHurtSteamIds.length }),
                React.createElement(Cell, { value: ownTeamDamage }),
                React.createElement(Cell, { value: ownDamage })));
        })));
    };
    return (React.createElement(React.Fragment, null,
        React.createElement(Middle, { area: "damages-title" },
            React.createElement(Title, null,
                React.createElement(Trans, null, "Damages"))),
        renderDamagesGrid(playersTeamA, 'damages-team-a'),
        React.createElement(Middle, { area: "damages-types" },
            React.createElement(Title, null,
                React.createElement(Trans, null, "Shots")),
            React.createElement(Title, null,
                React.createElement(Trans, null, "Damage dealt")),
            React.createElement(Title, null,
                React.createElement(Trans, null, "Opponents hurt")),
            React.createElement(Title, null,
                React.createElement(Trans, null, "Own damage")),
            React.createElement(Title, null,
                React.createElement(Trans, null, "Own team damage"))),
        renderDamagesGrid(playersTeamB, 'damages-team-b')));
}
function Economy({ roundPlayerEconomies, playersTeamA, playersTeamB }) {
    const formatMoney = useFormatMoney();
    const { translateEconomyType } = useTranslateEconomyType();
    const renderEconomyGrid = (players, gridArea) => {
        return (React.createElement(Grid, { area: gridArea, playerCount: players.length }, players.map((player) => {
            const playerEconomy = roundPlayerEconomies.find((playerEconomy) => {
                return playerEconomy.playerSteamId === player.steamId;
            });
            const equipmentValue = playerEconomy?.equipmentValue || 0;
            const startMoney = playerEconomy?.startMoney || 0;
            const moneySpent = playerEconomy?.moneySpent || 0;
            const economyType = playerEconomy?.type || EconomyType.Eco;
            return (React.createElement(GridRows, { key: player.steamId },
                React.createElement(Cell, { value: formatMoney(startMoney) }),
                React.createElement(Cell, { value: formatMoney(moneySpent) }),
                React.createElement(Cell, { value: formatMoney(equipmentValue) }),
                React.createElement(Cell, { value: translateEconomyType(economyType) })));
        })));
    };
    return (React.createElement(React.Fragment, null,
        React.createElement(Middle, { area: "economy-title" },
            React.createElement(Title, null,
                React.createElement(Trans, null, "Economy"))),
        renderEconomyGrid(playersTeamA, 'economy-team-a'),
        React.createElement(Middle, { area: "economy-types" },
            React.createElement(Title, null,
                React.createElement(Trans, null, "Cash")),
            React.createElement(Title, null,
                React.createElement(Trans, null, "Cash spent")),
            React.createElement(Title, null,
                React.createElement(Trans, null, "Equipment value")),
            React.createElement(Title, null,
                React.createElement(Trans, null, "Strategy"))),
        renderEconomyGrid(playersTeamB, 'economy-team-b')));
}
export function PlayersInformation() {
    const match = useCurrentMatch();
    const currentRound = useCurrentRound();
    const playersTeamA = match.players.filter((player) => player.teamName === match.teamA.name);
    const playersTeamB = match.players.filter((player) => player.teamName === match.teamB.name);
    const roundShots = match.shots.filter((shot) => {
        return shot.roundNumber === currentRound.number;
    });
    const roundKills = match.kills.filter((kill) => {
        return kill.roundNumber === currentRound.number;
    });
    const roundDamages = match.damages.filter((damage) => {
        return damage.roundNumber === currentRound.number;
    });
    const roundChickenDeaths = match.chickenDeaths.filter((damage) => {
        return damage.roundNumber === currentRound.number;
    });
    const roundPlayerEconomies = match.playersEconomies.filter((damage) => {
        return damage.roundNumber === currentRound.number;
    });
    return (React.createElement("div", { className: "border border-gray-200 bg-gray-75" },
        React.createElement("div", { className: "p-8" },
            React.createElement("p", { className: "text-body-strong" },
                React.createElement(Trans, null, "Players stats"))),
        React.createElement(MainGrid, null,
            React.createElement(Players, { playerCount: playersTeamA.length }, playersTeamA.map((player) => {
                return React.createElement(PlayerAvatar, { key: player.steamId, player: player });
            })),
            React.createElement(StickyHeader, null),
            React.createElement(Players, { playerCount: playersTeamB.length }, playersTeamB.map((player) => {
                return React.createElement(PlayerAvatar, { key: player.steamId, player: player });
            })),
            React.createElement(Gameplay, { roundKills: roundKills, playersTeamA: playersTeamA, playersTeamB: playersTeamB, round: currentRound }),
            React.createElement(Kills, { roundKills: roundKills, roundChickenDeaths: roundChickenDeaths, playersTeamA: playersTeamA, playersTeamB: playersTeamB }),
            React.createElement(Deaths, { roundKills: roundKills, playersTeamA: playersTeamA, playersTeamB: playersTeamB }),
            React.createElement(Grenades, { roundShots: roundShots, playersTeamA: playersTeamA, playersTeamB: playersTeamB }),
            React.createElement(Damages, { roundShots: roundShots, roundDamages: roundDamages, playersTeamA: playersTeamA, playersTeamB: playersTeamB }),
            React.createElement(Economy, { roundPlayerEconomies: roundPlayerEconomies, playersTeamA: playersTeamA, playersTeamB: playersTeamB }))));
}
//# sourceMappingURL=players-information.js.map