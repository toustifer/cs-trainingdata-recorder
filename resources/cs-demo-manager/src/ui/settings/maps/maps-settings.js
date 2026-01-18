import React, { useState } from 'react';
import { Trans } from '@lingui/react/macro';
import { Game } from 'csdm/common/types/counter-strike';
import { SettingsView } from 'csdm/ui/settings/settings-view';
import { Maps } from 'csdm/ui/settings/maps/maps';
import { AddMapButton } from './add-map-button';
import { ResetDefaultMapsButton } from './reset-default-maps-button';
import { Select } from 'csdm/ui/components/inputs/select';
import { InputLabel } from 'csdm/ui/components/inputs/input-label';
import { useGameOptions } from 'csdm/ui/hooks/use-game-options';
export function MapsSettings() {
    const [game, setGame] = useState(Game.CS2);
    const gameOptions = useGameOptions({ includeCs2LimitedTest: false });
    return (React.createElement(SettingsView, null,
        React.createElement("div", { className: "mb-12 flex items-center gap-x-8" },
            React.createElement(InputLabel, null,
                React.createElement(Trans, { context: "Select label" }, "Game")),
            React.createElement(Select, { options: gameOptions, onChange: (game) => {
                    setGame(game);
                } }),
            React.createElement(AddMapButton, { game: game }),
            React.createElement(ResetDefaultMapsButton, { game: game })),
        React.createElement(Maps, { game: game })));
}
//# sourceMappingURL=maps-settings.js.map