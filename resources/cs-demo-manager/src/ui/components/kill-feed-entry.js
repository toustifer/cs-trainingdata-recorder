import React from 'react';
import { TeamNumber, WeaponName } from 'csdm/common/types/counter-strike';
import { WEAPONS_ICONS } from 'csdm/ui/components/weapons-icons';
import { HeadshotIcon } from 'csdm/ui/icons/headshot-icon';
import { FlashbangAssistIcon } from 'csdm/ui/icons/flashbang-assist-icon';
import { ExplosionIcon } from 'csdm/ui/icons/explosion-icon';
import { WorldIcon } from 'csdm/ui/icons/weapons/world-icon';
import { RevengeIcon } from 'csdm/ui/icons/revenge-icon';
import { TeamText } from 'csdm/ui/components/team-text';
import { getTimeElapsedBetweenTicks } from 'csdm/ui/match/get-time-elapsed-between-ticks';
import { PenetrateIcon } from 'csdm/ui/icons/penetrate-icon';
import { BlindIcon } from 'csdm/ui/icons/blind-icon';
import { NoScopeIcon } from 'csdm/ui/icons/noscope-icon';
import { ThroughSmokeKillIcon } from 'csdm/ui/icons/through-smoke-kill-icon';
import { AirborneKillIcon } from 'csdm/ui/icons/airborne-kill-icon';
function isBombDeathKill(kill) {
    return kill.killerSide === TeamNumber.UNASSIGNED && kill.killerName === WeaponName.World;
}
function isSuicideKill(kill) {
    return kill.killerName === WeaponName.World && kill.weaponName === WeaponName.World;
}
function renderTradeKillIcon(kill) {
    if (!kill.isTradeKill) {
        return null;
    }
    return React.createElement(RevengeIcon, { height: 20 });
}
function renderBlindKillIcon(kill) {
    if (!kill.isKillerBlinded) {
        return null;
    }
    return React.createElement(BlindIcon, { height: 20 });
}
function renderKillerName(kill) {
    if (isBombDeathKill(kill)) {
        return null;
    }
    if (isSuicideKill(kill)) {
        return React.createElement(TeamText, { teamNumber: kill.victimSide }, kill.victimName);
    }
    return React.createElement(TeamText, { teamNumber: kill.killerSide }, kill.killerName);
}
function renderAssister(kill) {
    const { assisterName, assisterSide, isAssistedFlash } = kill;
    if (assisterName === '' || assisterSide === TeamNumber.UNASSIGNED) {
        return null;
    }
    return (React.createElement(React.Fragment, null,
        React.createElement("p", null, "+"),
        isAssistedFlash && React.createElement(FlashbangAssistIcon, { height: 20 }),
        React.createElement(TeamText, { teamNumber: assisterSide }, assisterName)));
}
function renderWeaponIcon(kill) {
    if (isSuicideKill(kill)) {
        return React.createElement(WorldIcon, { height: 20 });
    }
    if (isBombDeathKill(kill)) {
        return React.createElement(ExplosionIcon, { height: 20 });
    }
    const WeaponIcon = WEAPONS_ICONS[kill.weaponName];
    if (WeaponIcon === undefined) {
        return '?';
    }
    return React.createElement(WeaponIcon, { height: 20 });
}
function renderWeapon(kill) {
    return (React.createElement("div", { className: "flex gap-8" },
        kill.isKillerAirborne && React.createElement(AirborneKillIcon, { height: 18, className: "-mt-4 -mr-8" }),
        renderWeaponIcon(kill),
        kill.isNoScope && React.createElement(NoScopeIcon, { height: 20 }),
        kill.isThroughSmoke && React.createElement(ThroughSmokeKillIcon, { height: 20 }),
        kill.penetratedObjects > 0 && React.createElement(PenetrateIcon, { height: 20 }),
        kill.isHeadshot && React.createElement(HeadshotIcon, { height: 20 })));
}
function renderVictimName(kill) {
    return React.createElement(TeamText, { teamNumber: kill.victimSide }, kill.victimName);
}
export function KillFeedEntry({ kill, timeElapsedOption, right }) {
    return (React.createElement("div", { className: "flex items-center gap-8" },
        timeElapsedOption && (React.createElement("p", { className: "w-48" }, getTimeElapsedBetweenTicks({
            tickrate: timeElapsedOption.tickrate,
            startTick: timeElapsedOption.roundFreezetimeEndTick,
            endTick: kill.tick,
        }))),
        renderTradeKillIcon(kill),
        renderBlindKillIcon(kill),
        renderKillerName(kill),
        renderAssister(kill),
        renderWeapon(kill),
        renderVictimName(kill),
        React.createElement("div", { className: "ml-auto" }, right)));
}
//# sourceMappingURL=kill-feed-entry.js.map