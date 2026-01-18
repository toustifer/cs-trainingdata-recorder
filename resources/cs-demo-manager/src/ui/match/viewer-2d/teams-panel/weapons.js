import React from 'react';
import { WEAPONS_ICONS } from 'csdm/ui/components/weapons-icons';
export function Weapons({ weapons, currentWeapon, playerName }) {
    return (React.createElement("div", { className: "flex flex-wrap gap-x-4 opacity-50" }, weapons
        .filter((weaponName) => weaponName !== currentWeapon)
        .map((weaponName, index) => {
        const WeaponIcon = WEAPONS_ICONS[weaponName];
        if (WeaponIcon !== undefined) {
            return (React.createElement("div", { className: "relative", key: `weapon-${playerName}-${weaponName}-${index}` },
                React.createElement(WeaponIcon, { className: "h-20 fill-gray-800 stroke-gray-800" })));
        }
        return null;
    })));
}
//# sourceMappingURL=weapons.js.map