import React from 'react';
import { Weapons } from './weapons';
import { CurrentWeapon } from './current-weapon';
import { HealthArmorState } from './health-armor-state';
import { useViewerContext } from '../use-viewer-context';
import { buildPlayerId } from '../build-player-id';
export function PlayerRow({ steamId, isAlive, name, health, side, money, hasHelmet, hasBomb, armor, weapons, currentWeaponName, }) {
    const { focusedPlayerId, updateFocusedPlayerId } = useViewerContext();
    const playerId = buildPlayerId(steamId, name);
    const isFocused = focusedPlayerId === playerId;
    const onClick = () => {
        updateFocusedPlayerId(playerId);
    };
    return (React.createElement("div", { className: "relative flex cursor-pointer items-center gap-x-8 p-4", style: {
            boxShadow: isFocused ? '0 0 0 1px red inset' : undefined,
        }, onClick: onClick },
        React.createElement(HealthArmorState, { health: health, armor: armor, hasHelmet: hasHelmet, side: side, isAlive: isAlive, hasBomb: hasBomb }),
        React.createElement("div", { className: "flex w-[112px] flex-col justify-center" },
            React.createElement("p", { className: "truncate", title: name }, name),
            React.createElement("p", null, `$${money}`)),
        React.createElement(Weapons, { weapons: weapons, currentWeapon: currentWeaponName, playerName: name }),
        isAlive && React.createElement(CurrentWeapon, { weaponName: currentWeaponName })));
}
//# sourceMappingURL=player-row.js.map