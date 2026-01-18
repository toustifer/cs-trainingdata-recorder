import React from 'react';
import { TextInputFilter } from 'csdm/ui/components/inputs/text-input-filter';
import { useFuzzySearchText } from '../use-fuzzy-search-text';
import { useDispatch } from 'csdm/ui/store/use-dispatch';
import { fuzzySearchTextChanged } from '../players-actions';
import { usePlayersTable } from '../table/use-players-table';
export function FuzzySearchTextInput() {
    const dispatch = useDispatch();
    const fuzzySearchText = useFuzzySearchText();
    const table = usePlayersTable();
    const onChange = (text) => {
        dispatch(fuzzySearchTextChanged({
            text,
        }));
        table.setFuzzySearchText(text);
    };
    return React.createElement(TextInputFilter, { value: fuzzySearchText, onChange: onChange });
}
//# sourceMappingURL=fuzzy-search-text-input.js.map