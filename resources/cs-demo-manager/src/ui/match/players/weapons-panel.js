import React, {} from 'react';
import { Trans } from '@lingui/react/macro';
import { Panel, PanelTitle } from 'csdm/ui/components/panel';
import { roundNumber } from 'csdm/common/math/round-number';
function Value({ children }) {
    return React.createElement("span", { className: "selectable text-right" }, children);
}
function buildWeaponsStats(match, player, kills) {
    const stats = [];
    for (const kill of kills) {
        const weaponName = kill.weaponName;
        const hasStats = stats.some((weaponStats) => weaponStats.weaponName === weaponName);
        if (!hasStats) {
            const shotCount = match.shots.filter((shot) => {
                return shot.weaponName === weaponName && shot.playerSteamId === player.steamId;
            }).length;
            const damages = match.damages.filter((damage) => {
                return damage.weaponName === weaponName && damage.attackerSteamId === player.steamId;
            });
            const hitCount = damages.length;
            const damageCount = damages.reduce((total, damage) => total + damage.healthDamage, 0);
            const weaponKills = kills.filter((kill) => {
                return kill.weaponName === weaponName;
            });
            const headshotKillCount = weaponKills.filter((kill) => {
                return kill.isHeadshot;
            }).length;
            const killCount = weaponKills.length;
            const accuracy = shotCount === 0 ? 0 : roundNumber((hitCount / shotCount) * 100);
            const headshotPercentage = killCount === 0 ? 0 : roundNumber((headshotKillCount / killCount) * 100);
            stats.push({
                weaponName,
                shotCount,
                hitCount,
                killCount,
                damageCount,
                accuracy,
                headshotPercentage,
            });
        }
    }
    return stats.sort((dataA, dataB) => dataB.killCount - dataA.killCount);
}
export function WeaponsPanel({ match, player, kills }) {
    const stats = buildWeaponsStats(match, player, kills);
    return (React.createElement(Panel, { header: React.createElement(PanelTitle, null,
            React.createElement(Trans, { context: "Panel title" }, "Weapons")), fitHeight: true },
        React.createElement("div", { className: "grid grid-cols-7 gap-8 text-gray-900" },
            React.createElement("p", null,
                React.createElement(Trans, { context: "Panel label" }, "Name")),
            React.createElement("p", { className: "text-right" },
                React.createElement(Trans, { context: "Panel label" }, "Kills")),
            React.createElement("p", { className: "text-right" },
                React.createElement(Trans, { context: "Panel label" }, "HS%")),
            React.createElement("p", { className: "text-right" },
                React.createElement(Trans, { context: "Panel label" }, "Damages")),
            React.createElement("p", { className: "text-right" },
                React.createElement(Trans, { context: "Panel label" }, "Shots")),
            React.createElement("p", { className: "text-right" },
                React.createElement(Trans, { context: "Panel label" }, "Hits")),
            React.createElement("p", { className: "text-right" },
                React.createElement(Trans, { context: "Panel label" }, "Accuracy"))),
        stats.map((stat) => {
            return (React.createElement("div", { className: "grid grid-cols-7 gap-8", key: stat.weaponName },
                React.createElement("span", { className: "selectable" }, stat.weaponName),
                React.createElement(Value, null, stat.killCount),
                React.createElement(Value, null, stat.headshotPercentage),
                React.createElement(Value, null, stat.damageCount),
                React.createElement(Value, null, stat.shotCount),
                React.createElement(Value, null, stat.hitCount),
                React.createElement(Value, null, `${stat.accuracy}%`)));
        })));
}
//# sourceMappingURL=weapons-panel.js.map