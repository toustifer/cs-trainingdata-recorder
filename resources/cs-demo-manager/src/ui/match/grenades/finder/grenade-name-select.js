import React from 'react';
import { Trans, useLingui } from '@lingui/react/macro';
import { GrenadeName } from 'csdm/common/types/counter-strike';
import { InputLabel } from 'csdm/ui/components/inputs/input-label';
import { Select } from 'csdm/ui/components/inputs/select';
import { useDispatch } from 'csdm/ui/store/use-dispatch';
import { grenadeNameChanged } from 'csdm/ui/match/grenades/finder/grenades-finder-actions';
import { useSelectedGrenadeName } from 'csdm/ui/match/grenades/finder/use-selected-grenade-name';
export function GrenadeNameSelect() {
    const dispatch = useDispatch();
    const selectedGrenadeName = useSelectedGrenadeName();
    const { t } = useLingui();
    const options = [
        {
            label: t({
                context: 'Grenade name',
                message: 'Smoke',
            }),
            value: GrenadeName.Smoke,
        },
        {
            label: t({
                context: 'Grenade name',
                message: 'Flashbang',
            }),
            value: GrenadeName.Flashbang,
        },
        {
            label: t({
                context: 'Grenade name',
                message: 'HE Grenade',
            }),
            value: GrenadeName.HE,
        },
        {
            label: t({
                context: 'Grenade name',
                message: 'Decoy',
            }),
            value: GrenadeName.Decoy,
        },
        {
            label: t({
                context: 'Grenade name',
                message: 'Molotov',
            }),
            value: GrenadeName.Molotov,
        },
        {
            label: t({
                context: 'Grenade name',
                message: 'Incendiary',
            }),
            value: GrenadeName.Incendiary,
        },
    ];
    const onChange = (grenadeName) => {
        dispatch(grenadeNameChanged({ grenadeName }));
    };
    return (React.createElement("div", { className: "flex flex-col gap-y-8" },
        React.createElement(InputLabel, null,
            React.createElement(Trans, { context: "Input label" }, "Grenade")),
        React.createElement(Select, { onChange: onChange, options: options, value: selectedGrenadeName })));
}
//# sourceMappingURL=grenade-name-select.js.map