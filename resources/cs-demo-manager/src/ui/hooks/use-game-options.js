import { Game } from 'csdm/common/types/counter-strike';
import { getGameName } from '../shared/get-game-name';
export function useGameOptions({ includeCs2LimitedTest } = { includeCs2LimitedTest: true }) {
    const options = [Game.CS2, Game.CSGO].map((game) => ({
        value: game,
        label: getGameName(game),
    }));
    if (includeCs2LimitedTest) {
        options.push({
            value: Game.CS2LT,
            label: getGameName(Game.CS2LT),
        });
    }
    return options;
}
//# sourceMappingURL=use-game-options.js.map