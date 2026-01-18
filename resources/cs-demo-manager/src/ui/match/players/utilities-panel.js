import React from 'react';
import { WeaponName } from 'csdm/common/types/counter-strike';
import { UtilitiesPanel as CommonUtilitiesPanel } from 'csdm/ui/components/panels/utilities-panel';
export function UtilitiesPanel({ shots, steamId }) {
    const heGrenadeThrownCount = shots.filter((shot) => {
        return shot.weaponName === WeaponName.HEGrenade && shot.playerSteamId === steamId;
    }).length;
    const flashbangThrownCount = shots.filter((shot) => {
        return shot.weaponName === WeaponName.Flashbang && shot.playerSteamId === steamId;
    }).length;
    const smokeThrownCount = shots.filter((shot) => {
        return shot.weaponName === WeaponName.Smoke && shot.playerSteamId === steamId;
    }).length;
    const molotovThrownCount = shots.filter((shot) => {
        return shot.weaponName === WeaponName.Molotov && shot.playerSteamId === steamId;
    }).length;
    const incendiaryThrownCount = shots.filter((shot) => {
        return shot.weaponName === WeaponName.Incendiary && shot.playerSteamId === steamId;
    }).length;
    const decoyThrownCount = shots.filter((shot) => {
        return shot.weaponName === WeaponName.Decoy && shot.playerSteamId === steamId;
    }).length;
    return (React.createElement(CommonUtilitiesPanel, { decoyThrownCount: decoyThrownCount, flashbangThrownCount: flashbangThrownCount, heGrenadeThrownCount: heGrenadeThrownCount, incendiaryThrownCount: incendiaryThrownCount, molotovThrownCount: molotovThrownCount, smokeThrownCount: smokeThrownCount }));
}
//# sourceMappingURL=utilities-panel.js.map