import React from 'react';
import { Trans } from '@lingui/react/macro';
import { Select } from 'csdm/ui/components/inputs/select';
import { InputLabel } from 'csdm/ui/components/inputs/input-label';
import { useGameOptions } from 'csdm/ui/hooks/use-game-options';
export function CamerasGameInput({ game, onChange }) {
    const gameOptions = useGameOptions({ includeCs2LimitedTest: false });
    return (React.createElement("div", { className: "flex items-center gap-x-8" },
        React.createElement(InputLabel, null,
            React.createElement(Trans, { context: "Select label" }, "Game")),
        React.createElement(Select, { options: gameOptions, value: game, onChange: onChange })));
}
//# sourceMappingURL=cameras-game-input.js.map