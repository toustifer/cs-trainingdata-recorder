import React from 'react';
import { Trans } from '@lingui/react/macro';
import { useDispatch } from 'csdm/ui/store/use-dispatch';
import { useSearchState } from '../use-search-state';
import { RadioGroupTriState } from 'csdm/ui/components/inputs/radio/radio-group-tri-state';
import { collateralKillChanged, headshotChanged, jumpChanged, noScopeChanged, teamKillChanged, throughSmokeChanged, wallbangChanged, } from '../search-actions';
import { CollapseTransition } from 'csdm/ui/components/transitions/collapse-transition';
export function KillsFilter({ isVisible }) {
    const dispatch = useDispatch();
    const { headshot, noScope, wallbang, jump, throughSmoke, teamKill, collateralKill } = useSearchState();
    return (React.createElement("div", { className: isVisible ? '' : '-mb-12' },
        React.createElement(CollapseTransition, { isVisible: isVisible },
            React.createElement("div", { className: "flex flex-wrap gap-x-24 gap-y-10 pl-4 *:min-w-[100px]" },
                React.createElement(RadioGroupTriState, { label: React.createElement(Trans, null, "Headshot"), value: headshot, onChange: (headshot) => {
                        dispatch(headshotChanged({ headshot }));
                    } }),
                React.createElement(RadioGroupTriState, { label: React.createElement(Trans, null, "No scope"), value: noScope, onChange: (noScope) => {
                        dispatch(noScopeChanged({ noScope }));
                    } }),
                React.createElement(RadioGroupTriState, { label: React.createElement(Trans, null, "Wallbang"), value: wallbang, onChange: (wallbang) => {
                        dispatch(wallbangChanged({ wallbang }));
                    } }),
                React.createElement(RadioGroupTriState, { label: React.createElement(Trans, null, "Jump"), value: jump, onChange: (jump) => {
                        dispatch(jumpChanged({ jump }));
                    } }),
                React.createElement(RadioGroupTriState, { label: React.createElement(Trans, null, "Through smoke"), value: throughSmoke, onChange: (throughSmoke) => {
                        dispatch(throughSmokeChanged({ throughSmoke }));
                    } }),
                React.createElement(RadioGroupTriState, { label: React.createElement(Trans, null, "Team kill"), value: teamKill, onChange: (teamKill) => {
                        dispatch(teamKillChanged({ teamKill }));
                    } }),
                React.createElement(RadioGroupTriState, { label: React.createElement(Trans, null, "Collateral"), value: collateralKill, onChange: (collateralKill) => {
                        dispatch(collateralKillChanged({ collateralKill }));
                    } })))));
}
//# sourceMappingURL=kills-filter.js.map