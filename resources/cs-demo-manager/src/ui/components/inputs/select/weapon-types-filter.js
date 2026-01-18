import React from 'react';
import { Trans, useLingui } from '@lingui/react/macro';
import { WeaponType } from 'csdm/common/types/counter-strike';
import { FilterSelection } from '../../dropdown-filter/filter-selection';
import { FilterValue } from '../../dropdown-filter/filter-value';
export function WeaponTypesFilter({ onChange, selectedWeaponTypes }) {
    const { t } = useLingui();
    const weaponTypes = [
        {
            value: WeaponType.Pistol,
            label: t({
                id: 'weaponType.pistol',
                message: 'Pistol',
            }),
        },
        {
            value: WeaponType.SMG,
            label: t({
                id: 'weaponType.smg',
                message: 'SMG',
            }),
        },
        {
            value: WeaponType.Rifle,
            label: t({
                id: 'weaponType.rifle',
                message: 'Rifle',
            }),
        },
        {
            value: WeaponType.Sniper,
            label: t({
                id: 'weaponType.sniper',
                message: 'Sniper',
            }),
        },
        {
            value: WeaponType.Shotgun,
            label: t({
                id: 'weaponType.shotgun',
                message: 'Shotgun',
            }),
        },
        {
            value: WeaponType.MachineGun,
            label: t({
                id: 'weaponType.machineGun',
                message: 'Machine gun',
            }),
        },
        {
            value: WeaponType.Grenade,
            label: t({
                id: 'weaponType.grenade',
                message: 'Grenade',
            }),
        },
        {
            value: WeaponType.Melee,
            label: t({
                id: 'weaponType.melee',
                message: 'Melee',
            }),
        },
    ];
    return (React.createElement("div", { className: "flex flex-col gap-y-8" },
        React.createElement("div", { className: "flex items-baseline justify-between" },
            React.createElement("p", null,
                React.createElement(Trans, { context: "Filter weapon types category" }, "Weapon types")),
            React.createElement("div", { className: "mt-px ml-16" },
                React.createElement(FilterSelection, { onSelectAllClick: () => {
                        onChange(weaponTypes.map((weaponType) => weaponType.value));
                    }, onDeselectAllClick: () => {
                        onChange([]);
                    } }))),
        React.createElement("div", { className: "flex flex-wrap gap-4" }, weaponTypes.map((weaponType) => {
            const isSelected = selectedWeaponTypes.includes(weaponType.value);
            return (React.createElement(FilterValue, { key: weaponType.value, isSelected: isSelected, onClick: () => {
                    onChange(isSelected
                        ? selectedWeaponTypes.filter((type) => type !== weaponType.value)
                        : [...selectedWeaponTypes, weaponType.value]);
                } }, weaponType.label));
        }))));
}
//# sourceMappingURL=weapon-types-filter.js.map