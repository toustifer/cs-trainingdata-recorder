import React from 'react';
import { Trans } from '@lingui/react/macro';
import { GameMode } from 'csdm/common/types/counter-strike';
import { FilterCategory } from 'csdm/ui/components/dropdown-filter/filter-category';
import { FilterValue } from 'csdm/ui/components/dropdown-filter/filter-value';
import { FilterSelection } from 'csdm/ui/components/dropdown-filter/filter-selection';
import { useGetGameModeTranslation } from 'csdm/ui/hooks/use-get-game-mode-translation';
function useGameModes() {
    const getGameModeTranslation = useGetGameModeTranslation();
    return [
        {
            id: GameMode.Premier,
            name: getGameModeTranslation(GameMode.Premier),
        },
        {
            id: GameMode.Competitive,
            name: getGameModeTranslation(GameMode.Competitive),
        },
        {
            id: GameMode.Scrimmage5V5,
            name: getGameModeTranslation(GameMode.Scrimmage5V5),
        },
        {
            id: GameMode.Scrimmage2V2,
            name: getGameModeTranslation(GameMode.Scrimmage2V2),
        },
        {
            id: GameMode.Casual,
            name: getGameModeTranslation(GameMode.Casual),
        },
    ];
}
export function GameModesFilter({ selectedGameModes, onChange, hasActiveFilter }) {
    const modes = useGameModes();
    const onSelectAllClick = () => {
        const values = modes.map((mode) => mode.id);
        onChange(values);
    };
    const onDeselectAllClick = () => {
        onChange([]);
    };
    return (React.createElement(FilterCategory, { name: React.createElement(Trans, { context: "Game modes filter label" }, "Modes"), right: React.createElement(FilterSelection, { onSelectAllClick: onSelectAllClick, onDeselectAllClick: onDeselectAllClick, hasActiveFilter: hasActiveFilter }) }, modes.map((mode) => {
        const isSelected = selectedGameModes.includes(mode.id);
        const onClick = () => {
            const newSelectedGameModes = isSelected
                ? selectedGameModes.filter((id) => id !== mode.id)
                : [...selectedGameModes, mode.id];
            onChange(newSelectedGameModes);
        };
        return (React.createElement(FilterValue, { key: mode.id, isSelected: isSelected, onClick: onClick },
            React.createElement("span", null, mode.name)));
    })));
}
//# sourceMappingURL=game-modes-filter.js.map