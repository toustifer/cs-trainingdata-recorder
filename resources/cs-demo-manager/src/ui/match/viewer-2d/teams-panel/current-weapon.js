import React from 'react';
import { WEAPONS_ICONS } from 'csdm/ui/components/weapons-icons';
export function CurrentWeapon({ weaponName }) {
    const WeaponIcon = WEAPONS_ICONS[weaponName];
    if (WeaponIcon === undefined) {
        return null;
    }
    return (React.createElement("div", { className: "ml-auto flex" },
        React.createElement(WeaponIcon, { className: "h-24 fill-gray-800 stroke-gray-800" })));
}
//# sourceMappingURL=current-weapon.js.map