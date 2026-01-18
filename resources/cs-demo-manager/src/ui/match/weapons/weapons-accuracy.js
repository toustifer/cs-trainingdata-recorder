import React, { useState } from 'react';
import { Trans, useLingui } from '@lingui/react/macro';
import clsx from 'clsx';
import { HitGroup, WeaponType } from 'csdm/common/types/counter-strike';
import { Body } from './body';
import { RoundsSelect } from 'csdm/ui/components/inputs/select/rounds-select';
import { SideSelect } from 'csdm/ui/components/inputs/select/side-select';
import { PlayersSelect } from 'csdm/ui/components/inputs/select/players-select';
import { TeamsSelect } from 'csdm/ui/components/inputs/select/teams-select';
import { useCurrentMatch } from '../use-current-match';
import { WeaponTypesFilter } from 'csdm/ui/components/inputs/select/weapon-types-filter';
import { roundNumber } from 'csdm/common/math/round-number';
import { ArrowUpLongIcon } from 'csdm/ui/icons/arrow-up-long-icon';
import { ArrowDownLongIcon } from 'csdm/ui/icons/arrow-down-long-icon';
import { WEAPONS_ICONS } from 'csdm/ui/components/weapons-icons';
function buildHitGroupData(damages, totalDamageCount) {
    return {
        hitCount: damages.length,
        killCount: damages.filter((damage) => {
            return damage.victimNewHealth === 0;
        }).length,
        damageCount: damages.reduce((previousDamage, damage) => {
            return previousDamage + damage.healthDamage;
        }, 0),
        accuracy: roundNumber((damages.length / totalDamageCount) * 100, 1),
    };
}
function getFilteredDamages(filters, damages, weaponName) {
    let filteredDamages = damages.filter((damage) => {
        if (damage.weaponType === WeaponType.Melee) {
            return true;
        }
        return damage.hitgroup !== HitGroup.Generic && damage.hitgroup !== HitGroup.Gear;
    });
    if (weaponName) {
        filteredDamages = filteredDamages.filter((damage) => damage.weaponName === weaponName);
    }
    const { roundsNumber, teamNames, steamIds, sides, weaponTypes } = filters;
    if (roundsNumber.length > 0) {
        filteredDamages = filteredDamages.filter((damage) => roundsNumber.includes(damage.roundNumber));
    }
    if (teamNames.length > 0) {
        filteredDamages = filteredDamages.filter((damage) => teamNames.includes(damage.attackerTeamName));
    }
    if (sides.length > 0) {
        filteredDamages = filteredDamages.filter((damage) => sides.includes(damage.attackerSide));
    }
    if (steamIds.length > 0) {
        filteredDamages = filteredDamages.filter((damage) => steamIds.includes(damage.attackerSteamId));
    }
    if (weaponTypes.length > 0) {
        filteredDamages = filteredDamages.filter((damage) => weaponTypes.includes(damage.weaponType));
    }
    return filteredDamages;
}
function getWeaponKills(weaponName, filters, match) {
    let filteredKills = match.kills.filter((kill) => kill.weaponName === weaponName);
    const { roundsNumber, teamNames, steamIds, sides, weaponTypes } = filters;
    if (roundsNumber.length > 0) {
        filteredKills = filteredKills.filter((kill) => roundsNumber.includes(kill.roundNumber));
    }
    if (teamNames.length > 0) {
        filteredKills = filteredKills.filter((kill) => teamNames.includes(kill.killerTeamName));
    }
    if (sides.length > 0) {
        filteredKills = filteredKills.filter((kill) => sides.includes(kill.killerSide));
    }
    if (steamIds.length > 0) {
        filteredKills = filteredKills.filter((kill) => steamIds.includes(kill.killerSteamId));
    }
    if (weaponTypes.length > 0) {
        filteredKills = filteredKills.filter((kill) => weaponTypes.includes(kill.weaponType));
    }
    return filteredKills;
}
function getWeaponShots(weaponName, filters, match) {
    let filteredShots = match.shots.filter((shot) => shot.weaponName === weaponName);
    const { roundsNumber, teamNames, steamIds, sides } = filters;
    if (roundsNumber.length > 0) {
        filteredShots = filteredShots.filter((shot) => roundsNumber.includes(shot.roundNumber));
    }
    if (teamNames.length > 0) {
        filteredShots = filteredShots.filter((shot) => teamNames.includes(shot.playerTeamName));
    }
    if (sides.length > 0) {
        filteredShots = filteredShots.filter((shot) => sides.includes(shot.playerSide));
    }
    if (steamIds.length > 0) {
        filteredShots = filteredShots.filter((shot) => steamIds.includes(shot.playerSteamId));
    }
    return filteredShots;
}
function getBodyDataFromFilters(filters, damages) {
    const filteredDamages = getFilteredDamages(filters, damages);
    const totalDamageCount = filteredDamages.length;
    const leftArmDamages = filteredDamages.filter((damage) => damage.hitgroup === HitGroup.LeftArm);
    const rightArmDamages = filteredDamages.filter((damage) => damage.hitgroup === HitGroup.RightArm);
    const chestDamages = filteredDamages.filter((damage) => damage.hitgroup === HitGroup.Chest);
    const headDamages = filteredDamages.filter((damage) => damage.hitgroup === HitGroup.Head);
    const neckDamages = filteredDamages.filter((damage) => damage.hitgroup === HitGroup.Neck);
    const leftLegDamages = filteredDamages.filter((damage) => damage.hitgroup === HitGroup.LeftLeg);
    const rightLegDamages = filteredDamages.filter((damage) => damage.hitgroup === HitGroup.RightLeg);
    const stomachDamages = filteredDamages.filter((damage) => damage.hitgroup === HitGroup.Stomach);
    const bodyData = {
        leftArm: buildHitGroupData(leftArmDamages, totalDamageCount),
        rightArm: buildHitGroupData(rightArmDamages, totalDamageCount),
        chest: buildHitGroupData(chestDamages, totalDamageCount),
        head: buildHitGroupData(headDamages, totalDamageCount),
        neck: buildHitGroupData(neckDamages, totalDamageCount),
        leftLeg: buildHitGroupData(leftLegDamages, totalDamageCount),
        rightLeg: buildHitGroupData(rightLegDamages, totalDamageCount),
        stomach: buildHitGroupData(stomachDamages, totalDamageCount),
    };
    return bodyData;
}
function buildWeaponsStats(filters, match) {
    const weaponsStats = {};
    for (const { weaponName, weaponType } of match.damages) {
        if (weaponsStats[weaponName]) {
            continue;
        }
        const damages = getFilteredDamages(filters, match.damages, weaponName);
        const damageCount = damages.reduce((previousDamage, damage) => previousDamage + damage.healthDamage, 0);
        if (damageCount === 0) {
            continue;
        }
        const killCount = getWeaponKills(weaponName, filters, match).length;
        const shotCount = getWeaponShots(weaponName, filters, match).length;
        const hitCount = damages.length;
        const headshotCount = damages.filter((damage) => damage.hitgroup === HitGroup.Head).length;
        weaponsStats[weaponName] = {
            name: weaponName,
            type: weaponType,
            killCount,
            hitCount,
            shotCount,
            damageCount,
            headshotCount,
            accuracy: roundNumber((hitCount / shotCount) * 100, 1),
            headshotPercentage: roundNumber((headshotCount / hitCount) * 100, 1),
        };
    }
    const allStats = Object.values(weaponsStats);
    const rifles = allStats.filter((weapon) => weapon.type === WeaponType.Rifle);
    const pistols = allStats.filter((weapon) => weapon.type === WeaponType.Pistol);
    const smgs = allStats.filter((weapon) => weapon.type === WeaponType.SMG);
    const snipers = allStats.filter((weapon) => weapon.type === WeaponType.Sniper);
    const machineGuns = allStats.filter((weapon) => weapon.type === WeaponType.MachineGun);
    const melee = allStats.filter((weapon) => weapon.type === WeaponType.Melee);
    return { rifles, pistols, smgs, snipers, machineGuns, melee };
}
function HitGroupStats({ text, value }) {
    return (React.createElement("div", { className: "grid grid-cols-[minmax(auto,100px)_repeat(3,auto)] items-center gap-12" },
        React.createElement("div", { className: "flex" },
            React.createElement("p", { className: "text-body-strong" }, text)),
        React.createElement("div", { className: "flex flex-col" },
            React.createElement("p", { className: "selectable" },
                React.createElement(Trans, null, "Damages")),
            React.createElement("p", { className: "selectable text-subtitle" }, value.damageCount)),
        React.createElement("div", { className: "flex flex-col" },
            React.createElement("p", { className: "selectable" },
                React.createElement(Trans, null, "Hits")),
            React.createElement("p", { className: "selectable text-subtitle" }, value.hitCount)),
        React.createElement("div", { className: "flex flex-col" },
            React.createElement("p", { className: "selectable" },
                React.createElement(Trans, null, "Kills")),
            React.createElement("p", { className: "selectable text-subtitle" }, value.killCount))));
}
function Cell({ children }) {
    return React.createElement("div", { className: "selectable px-8" }, children);
}
function HeaderCell({ children, onClick, sortDirection }) {
    return (React.createElement("div", { className: "flex items-center justify-between px-8", onClick: onClick },
        React.createElement("span", null, children),
        React.createElement("div", { className: clsx('pr-4', sortDirection ? 'opacity-100' : 'opacity-0') }, sortDirection === 'desc' ? React.createElement(ArrowDownLongIcon, { height: 16 }) : React.createElement(ArrowUpLongIcon, { height: 16 }))));
}
function WeaponsTable({ weapons, title }) {
    const [sort, setSort] = useState({
        column: 'killCount',
        direction: 'desc',
    });
    const isAscSort = sort.direction === 'asc';
    const sortedWeapons = weapons.sort((a, b) => {
        const valueA = a[sort.column];
        const valueB = b[sort.column];
        if (typeof valueA === 'string' && typeof valueB === 'string') {
            return isAscSort ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
        }
        const sign = isAscSort ? 1 : -1;
        return sign * (Number(valueA) - Number(valueB));
    });
    const updateSort = (column) => {
        setSort({
            column,
            direction: sort.direction === 'asc' ? 'desc' : 'asc',
        });
    };
    return (React.createElement("div", { className: "flex flex-col" },
        React.createElement("p", { className: "mb-8 text-body-strong" }, title),
        React.createElement("div", { className: "grid grid-cols-6 rounded-t bg-gray-100 py-4" },
            React.createElement(HeaderCell, { onClick: () => {
                    updateSort('name');
                }, sortDirection: sort.column === 'name' ? sort.direction : undefined },
                React.createElement(Trans, { context: "Table header" }, "Name")),
            React.createElement(HeaderCell, { onClick: () => {
                    updateSort('killCount');
                }, sortDirection: sort.column === 'killCount' ? sort.direction : undefined },
                React.createElement(Trans, { context: "Table header" }, "Kills")),
            React.createElement(HeaderCell, { onClick: () => {
                    updateSort('damageCount');
                }, sortDirection: sort.column === 'damageCount' ? sort.direction : undefined },
                React.createElement(Trans, { context: "Table header" }, "Damages")),
            React.createElement(HeaderCell, { onClick: () => {
                    updateSort('hitCount');
                }, sortDirection: sort.column === 'hitCount' ? sort.direction : undefined },
                React.createElement(Trans, { context: "Table header" }, "Hits")),
            React.createElement(HeaderCell, { onClick: () => {
                    updateSort('accuracy');
                }, sortDirection: sort.column === 'accuracy' ? sort.direction : undefined },
                React.createElement(Trans, { context: "Table header" }, "Accuracy")),
            React.createElement(HeaderCell, { onClick: () => {
                    updateSort('headshotPercentage');
                }, sortDirection: sort.column === 'headshotPercentage' ? sort.direction : undefined },
                React.createElement(Trans, { context: "Table header" }, "HS%"))),
        sortedWeapons.map((weapon) => {
            const WeaponIcon = WEAPONS_ICONS[weapon.name];
            return (React.createElement("div", { key: weapon.name, className: "grid grid-cols-6 border border-gray-200 py-4 last:rounded-b" },
                React.createElement(Cell, null,
                    React.createElement("div", { className: "flex items-center gap-x-4" },
                        WeaponIcon ? React.createElement(WeaponIcon, { height: 20 }) : React.createElement("span", null, "?"),
                        React.createElement("span", { className: "selectable" }, weapon.name))),
                React.createElement(Cell, null, weapon.killCount),
                React.createElement(Cell, null, weapon.damageCount),
                React.createElement(Cell, null, weapon.hitCount),
                React.createElement(Cell, null, weapon.accuracy),
                React.createElement(Cell, null, weapon.headshotPercentage)));
        })));
}
export function WeaponsAccuracy() {
    const match = useCurrentMatch();
    const { t } = useLingui();
    const [filters, setFilters] = useState({
        roundsNumber: [],
        teamNames: [],
        sides: [],
        steamIds: [],
        weaponTypes: [],
    });
    const bodyData = getBodyDataFromFilters(filters, match.damages);
    const { rifles, pistols, smgs, snipers, machineGuns, melee } = buildWeaponsStats(filters, match);
    return (React.createElement("div", { className: "flex flex-col gap-y-12" },
        React.createElement("div", { className: "grid grid-cols-[1fr_1fr_auto_auto_1fr] gap-x-8" },
            React.createElement(RoundsSelect, { rounds: match.rounds, selectedRoundNumbers: filters.roundsNumber, onChange: (roundsNumber) => {
                    setFilters({
                        ...filters,
                        roundsNumber,
                    });
                } }),
            React.createElement(PlayersSelect, { players: match.players, selectedSteamIds: filters.steamIds, onChange: (steamIds) => {
                    setFilters({
                        ...filters,
                        steamIds,
                    });
                } }),
            React.createElement(TeamsSelect, { teamNameA: match.teamA.name, teamNameB: match.teamB.name, selectedTeamNames: filters.teamNames, onChange: (selectedTeam) => {
                    setFilters({
                        ...filters,
                        teamNames: selectedTeam ? [selectedTeam] : [],
                    });
                } }),
            React.createElement(SideSelect, { selectedSides: filters.sides, onChange: (selectedSide) => {
                    setFilters({
                        ...filters,
                        sides: selectedSide === undefined ? [] : [selectedSide],
                    });
                } }),
            React.createElement(WeaponTypesFilter, { onChange: (weaponTypes) => {
                    setFilters({
                        ...filters,
                        weaponTypes,
                    });
                }, selectedWeaponTypes: filters.weaponTypes })),
        React.createElement("div", { className: "flex flex-wrap gap-16" },
            React.createElement("div", { className: "flex flex-col flex-wrap gap-12" },
                rifles.length > 0 && React.createElement(WeaponsTable, { title: t `Rifles`, weapons: rifles }),
                pistols.length > 0 && React.createElement(WeaponsTable, { title: t `Pistols`, weapons: pistols }),
                smgs.length > 0 && React.createElement(WeaponsTable, { title: t `SMGs`, weapons: smgs }),
                snipers.length > 0 && React.createElement(WeaponsTable, { title: t `Snipers`, weapons: snipers }),
                machineGuns.length > 0 && React.createElement(WeaponsTable, { title: t `Machine guns`, weapons: machineGuns }),
                melee.length > 0 && React.createElement(WeaponsTable, { title: t `Melee`, weapons: melee })),
            React.createElement("div", { className: "flex h-fit" },
                React.createElement("div", { className: "flex flex-none self-center" },
                    React.createElement(Body, { data: bodyData, width: 200 })),
                React.createElement("div", { className: "flex flex-col justify-evenly" },
                    React.createElement(HitGroupStats, { text: React.createElement(Trans, null, "Head"), value: bodyData.head }),
                    React.createElement(HitGroupStats, { text: React.createElement(Trans, null, "Neck"), value: bodyData.neck }),
                    React.createElement(HitGroupStats, { text: React.createElement(Trans, null, "Chest"), value: bodyData.chest }),
                    React.createElement(HitGroupStats, { text: React.createElement(Trans, null, "Stomach"), value: bodyData.stomach }),
                    React.createElement(HitGroupStats, { text: React.createElement(Trans, null, "Left arm"), value: bodyData.leftArm }),
                    React.createElement(HitGroupStats, { text: React.createElement(Trans, null, "Right arm"), value: bodyData.rightArm }),
                    React.createElement(HitGroupStats, { text: React.createElement(Trans, null, "Left leg"), value: bodyData.leftLeg }),
                    React.createElement(HitGroupStats, { text: React.createElement(Trans, null, "Right leg"), value: bodyData.rightLeg }))))));
}
//# sourceMappingURL=weapons-accuracy.js.map