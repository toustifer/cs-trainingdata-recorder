import React, { useEffect } from 'react';
import { WeaponName } from 'csdm/common/types/counter-strike';
import { useDispatch } from 'csdm/ui/store/use-dispatch';
import { periodChanged, mapRemoved, mapSelected, playerRemoved, playerSelected, searchError, searchStart, searchSuccess, demoSourcesChanged, roundTagIdsChanged, matchTagIdsChanged, victimSelected, victimRemoved, weaponNamesChanged, } from './search-actions';
import { useSearchState } from './use-search-state';
import { Button, ButtonVariant } from 'csdm/ui/components/buttons/button';
import { useWebSocketClient } from 'csdm/ui/hooks/use-web-socket-client';
import { RendererClientMessageName } from 'csdm/server/renderer-client-message-name';
import { SearchPlayersInput } from './filters/search-players-input';
import { SearchResults } from './search-results';
import { Status } from 'csdm/common/types/status';
import { SearchEventInput } from './filters/search-event-input';
import { SearchMapsInput } from './filters/search-maps-input';
import { PeriodFilter } from 'csdm/ui/components/dropdown-filter/period-filter';
import { formatDate } from 'csdm/common/date/date-range';
import { SourcesFilter } from 'csdm/ui/components/dropdown-filter/sources-filter';
import { Trans } from '@lingui/react/macro';
import { TagsFilter } from '../components/dropdown-filter/tags-filter';
import { isCtrlOrCmdEvent } from '../keyboard/keyboard';
import { WeaponsFilter } from '../components/dropdown-filter/weapons-filter';
import { KillsFilter } from './filters/kills-filter';
import { SearchEvent } from 'csdm/common/types/search/search-event';
export function Search() {
    const dispatch = useDispatch();
    const client = useWebSocketClient();
    const { status, event, players, victims, mapNames, startDate, endDate, demoSources, roundTagIds, matchTagIds, weaponNames, headshot, noScope, wallbang, jump, throughSmoke, teamKill, collateralKill, } = useSearchState();
    const isLoading = status === Status.Loading;
    const isEventWithKills = event.toLowerCase().includes('kill');
    const canFilterOnVictims = isEventWithKills;
    const canFilterOnWeapons = isEventWithKills;
    const weapons = [
        WeaponName.Knife,
        WeaponName.Zeus,
        WeaponName.AK47,
        WeaponName.AUG,
        WeaponName.AWP,
        WeaponName.CZ75,
        WeaponName.Deagle,
        WeaponName.DualBerettas,
        WeaponName.Famas,
        WeaponName.FiveSeven,
        WeaponName.G3SG1,
        WeaponName.GalilAR,
        WeaponName.Glock,
        WeaponName.M249,
        WeaponName.M4A1,
        WeaponName.M4A4,
        WeaponName.MAG7,
        WeaponName.MP5,
        WeaponName.MP7,
        WeaponName.Mac10,
        WeaponName.Negev,
        WeaponName.Nova,
        WeaponName.P2000,
        WeaponName.P250,
        WeaponName.P90,
        WeaponName.PPBizon,
        WeaponName.Revolver,
        WeaponName.SG553,
        WeaponName.SawedOff,
        WeaponName.Scar20,
        WeaponName.Scout,
        WeaponName.Tec9,
        WeaponName.UMP45,
        WeaponName.USP,
        WeaponName.XM1014,
        WeaponName.Decoy,
        WeaponName.Flashbang,
        WeaponName.HEGrenade,
        WeaponName.Incendiary,
        WeaponName.Molotov,
        WeaponName.Smoke,
    ];
    const onPlayerSelected = (player) => {
        dispatch(playerSelected({ player }));
    };
    const onPlayerRemoved = (player) => {
        dispatch(playerRemoved({ steamId: player.steamId }));
    };
    const onVictimSelected = (victim) => {
        dispatch(victimSelected({ victim }));
    };
    const onVictimRemoved = (victim) => {
        dispatch(victimRemoved({ steamId: victim.steamId }));
    };
    const onMapSelected = (mapName) => {
        dispatch(mapSelected({ mapName }));
    };
    const onMapRemoved = (mapName) => {
        dispatch(mapRemoved({ mapName }));
    };
    const onDemoSourcesChanged = (demoSources) => {
        dispatch(demoSourcesChanged({ demoSources }));
    };
    const onRoundTagIdsChanged = (tagIds) => {
        dispatch(roundTagIdsChanged({ tagIds }));
    };
    const onMatchTagIdsChanged = (tagIds) => {
        dispatch(matchTagIdsChanged({ tagIds }));
    };
    const onWeaponNamesChanged = (weaponNames) => {
        dispatch(weaponNamesChanged({ weaponNames }));
    };
    const search = async () => {
        try {
            dispatch(searchStart());
            const steamIds = players.map((player) => player.steamId);
            const victimSteamIds = victims.map((victim) => victim.steamId);
            const result = await client.send({
                name: RendererClientMessageName.SearchEvent,
                payload: {
                    event,
                    steamIds,
                    mapNames,
                    weaponNames,
                    startDate,
                    endDate,
                    demoSources,
                    roundTagIds,
                    matchTagIds,
                    victimSteamIds,
                    headshot,
                    noScope,
                    wallbang,
                    jump,
                    throughSmoke,
                    teamKill,
                    collateralKill,
                },
            });
            dispatch(searchSuccess({ result }));
        }
        catch (errorCode) {
            dispatch(searchError({ errorCode: errorCode }));
        }
    };
    const onPeriodChange = (range) => {
        const startDate = formatDate(range?.from);
        const endDate = formatDate(range?.to);
        dispatch(periodChanged({ startDate, endDate }));
    };
    useEffect(() => {
        const onKeyDown = (e) => {
            if (e.key === 'Enter' && isCtrlOrCmdEvent(e)) {
                search();
            }
        };
        window.addEventListener('keydown', onKeyDown);
        return () => {
            window.removeEventListener('keydown', onKeyDown);
        };
    });
    return (React.createElement("div", { className: "flex flex-1 flex-col overflow-y-auto" },
        React.createElement("div", { className: "flex h-full gap-x-12" },
            React.createElement("div", { className: "flex w-[324px] flex-none flex-col gap-y-12 overflow-y-auto border-r border-gray-200 py-16 pr-8 pl-16 scrollbar-stable" },
                React.createElement("div", { className: "flex flex-col gap-y-8" },
                    React.createElement(Trans, { context: "Input label" }, "Event"),
                    React.createElement(SearchEventInput, null)),
                React.createElement(KillsFilter, { isVisible: event === SearchEvent.Kills }),
                React.createElement(SearchPlayersInput, { isDisabled: isLoading, selectedPlayers: players, onPlayerSelected: onPlayerSelected, onPlayerRemoved: onPlayerRemoved }),
                canFilterOnVictims && (React.createElement("div", { className: "flex flex-col gap-y-8" },
                    React.createElement(SearchPlayersInput, { label: React.createElement(Trans, { context: "Input label" }, "Victims"), isDisabled: isLoading, selectedPlayers: victims, onPlayerSelected: onVictimSelected, onPlayerRemoved: onVictimRemoved }))),
                canFilterOnWeapons && (React.createElement(WeaponsFilter, { weapons: weapons, selectedWeapons: weaponNames, hasActiveFilter: weaponNames.length > 0, onChange: onWeaponNamesChanged })),
                React.createElement("div", { className: "flex flex-col gap-y-8" },
                    React.createElement(Trans, { context: "Input label" }, "Maps"),
                    React.createElement(SearchMapsInput, { isDisabled: isLoading, selectedMaps: mapNames, onMapSelected: onMapSelected, onMapRemoved: onMapRemoved })),
                React.createElement("div", null,
                    React.createElement(SourcesFilter, { selectedSources: demoSources, onChange: onDemoSourcesChanged, hasActiveFilter: demoSources.length > 0 })),
                React.createElement("div", null,
                    React.createElement(TagsFilter, { selectedTagIds: matchTagIds, onChange: onMatchTagIdsChanged, hasActiveFilter: matchTagIds.length > 0 })),
                React.createElement("div", null,
                    React.createElement(TagsFilter, { selectedTagIds: roundTagIds, onChange: onRoundTagIdsChanged, hasActiveFilter: roundTagIds.length > 0, title: React.createElement(Trans, { context: "Round tags filter label" }, "Round tags") })),
                React.createElement("div", { className: "flex flex-col gap-y-8" },
                    React.createElement("p", null,
                        React.createElement(Trans, { context: "Input label" }, "Period")),
                    React.createElement(PeriodFilter, { isDisabled: isLoading, startDate: startDate, endDate: endDate, onRangeChange: onPeriodChange, showFilterIndicator: false })),
                React.createElement("div", null,
                    React.createElement(Button, { variant: ButtonVariant.Primary, onClick: search, isDisabled: isLoading },
                        React.createElement(Trans, { context: "Button" }, "Search")))),
            React.createElement("div", { className: "w-full py-16 pr-16" },
                React.createElement(SearchResults, null)))));
}
//# sourceMappingURL=search.js.map