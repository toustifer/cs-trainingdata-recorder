import React from 'react';
import { SideSelect } from 'csdm/ui/components/inputs/select/side-select';
import { useDispatch } from 'csdm/ui/store/use-dispatch';
import { sidesChanged } from './grenades-finder-actions';
import { useSelectedSides } from './use-selected-sides';
export function FinderSideSelect() {
    const selectedSides = useSelectedSides();
    const dispatch = useDispatch();
    return (React.createElement(SideSelect, { selectedSides: selectedSides, onChange: (selectedSide) => {
            dispatch(sidesChanged({ sides: selectedSide === undefined ? [] : [selectedSide] }));
        } }));
}
//# sourceMappingURL=side-select.js.map