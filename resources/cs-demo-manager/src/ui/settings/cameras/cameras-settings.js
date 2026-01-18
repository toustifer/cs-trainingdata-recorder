import React, { useState } from 'react';
import { Trans } from '@lingui/react/macro';
import { Game } from 'csdm/common/types/counter-strike';
import { SettingsView } from 'csdm/ui/settings/settings-view';
import { Cameras } from './cameras';
import { AddCameraButton } from './add-camera-button';
import { CamerasMapInput } from './cameras-map-input';
import { CamerasGameInput } from './cameras-game-input';
import { useGameMaps, useGetGameMaps } from 'csdm/ui/maps/use-game-maps';
import { ErrorMessage } from 'csdm/ui/components/error-message';
function getDefaultMapName(maps) {
    if (maps.length === 0) {
        return '';
    }
    const dust2Map = maps.find((map) => map.name.toLowerCase() === 'de_dust2');
    if (dust2Map) {
        return dust2Map.name;
    }
    return maps[0].name;
}
export function CamerasSettings() {
    const [game, setGame] = useState(Game.CS2);
    const getGameMaps = useGetGameMaps();
    const maps = useGameMaps(game);
    const [mapName, setMapName] = useState(getDefaultMapName(maps));
    const renderContent = () => {
        if (maps.length === 0) {
            return React.createElement(ErrorMessage, { message: React.createElement(Trans, null, "No maps found for the selected game.") });
        }
        if (!mapName) {
            return React.createElement(ErrorMessage, { message: React.createElement(Trans, null, "Map not found") });
        }
        return React.createElement(Cameras, { game: game, mapName: mapName });
    };
    return (React.createElement(SettingsView, null,
        React.createElement("div", { className: "mb-12 flex items-center gap-x-16" },
            React.createElement(CamerasGameInput, { game: game, onChange: (game) => {
                    setGame(game);
                    const maps = getGameMaps(game);
                    setMapName(getDefaultMapName(maps));
                } }),
            maps.length > 0 && React.createElement(CamerasMapInput, { maps: maps, mapName: mapName, onChange: setMapName }),
            mapName && React.createElement(AddCameraButton, { game: game, mapName: mapName })),
        renderContent()));
}
//# sourceMappingURL=cameras-settings.js.map