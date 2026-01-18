import { fetchShots } from 'csdm/node/database/shots/fetch-shots';
import { fetchGrenadePositions } from 'csdm/node/database/grenade-position/fetch-grenade-positions';
import { fetchRound } from 'csdm/node/database/rounds/fetch-round';
import { fetchInfernoPositions } from 'csdm/node/database/inferno-position/fetch-inferno-positions';
import { fetchPlayersPositions } from 'csdm/node/database/player-position/fetch-players-positions';
import { fetchHostagePositions } from 'csdm/node/database/hostage-position/fetch-hostage-positions';
import { fetchBombExploded } from 'csdm/node/database/bomb-exploded/fetch-bomb-exploded';
import { fetchBombPlanted } from 'csdm/node/database/bomb-planted/fetch-bomb-planted';
import { fetchBombDefused } from 'csdm/node/database/bomb-defused/fetch-bomb-defused';
import { fetchBombsPlantStart } from 'csdm/node/database/bomb-plant-start/fetch-bombs-plant-start';
import { fetchBombsDefuseStart } from 'csdm/node/database/bomb-defuse-start/fetch-bombs-defuse-start';
import { fetchHostagesPickUpStart } from 'csdm/node/database/hostage-pick-up-start/fetch-hostages-pick-up-start';
import { fetchHostagesPickedUp } from 'csdm/node/database/hostage-picked-up/fetch-hostages-picked-up';
import { fetchChickenPositions } from 'csdm/node/database/chicken-position/fetch-chicken-positions';
import { fetchHeGrenadesExplode } from 'csdm/node/database/he-grenade-exploded/fetch-he-grenades-explode';
import { fetchDecoysStart } from 'csdm/node/database/decoy-started/fetch-decoys-start';
import { fetchSmokesStart } from 'csdm/node/database/smoke-started/fetch-smokes-start';
import { fetchFlashbangsExplode } from 'csdm/node/database/flashbang-exploded/fetch-flashbangs-explode';
import { fetchKills } from 'csdm/node/database/kills/fetch-kills';
import { handleError } from '../../handle-error';
import { getDemoAudioFilePath } from 'csdm/node/demo/get-demo-audio-file-path';
export async function fetch2DViewerDataHandler({ checksum, roundNumber, demoFilePath }) {
    try {
        const [playerPositions, round, kills, shots, grenadePositions, infernoPositions, hostagesPickUpStart, hostagesPickedUp, hostagePositions, bombExploded, bombPlanted, bombDefused, bombsPlantStart, bombsDefuseStart, chickenPositions, heGrenadesExplode, decoysStart, smokesStart, flashbangsExplode, audioFilePath,] = await Promise.all([
            fetchPlayersPositions(checksum, roundNumber),
            fetchRound(checksum, roundNumber),
            fetchKills(checksum, roundNumber),
            fetchShots({
                checksum,
                roundNumber,
            }),
            fetchGrenadePositions(checksum, roundNumber),
            fetchInfernoPositions(checksum, roundNumber),
            fetchHostagesPickUpStart(checksum, roundNumber),
            fetchHostagesPickedUp(checksum, roundNumber),
            fetchHostagePositions(checksum, roundNumber),
            fetchBombExploded(checksum, roundNumber),
            fetchBombPlanted(checksum, roundNumber),
            fetchBombDefused(checksum, roundNumber),
            fetchBombsPlantStart(checksum, roundNumber),
            fetchBombsDefuseStart(checksum, roundNumber),
            fetchChickenPositions(checksum, roundNumber),
            fetchHeGrenadesExplode(checksum, roundNumber),
            fetchDecoysStart(checksum, roundNumber),
            fetchSmokesStart(checksum, roundNumber),
            fetchFlashbangsExplode(checksum, roundNumber),
            getDemoAudioFilePath(demoFilePath),
        ]);
        const payload = {
            round,
            kills,
            shots,
            playerPositions,
            grenadePositions,
            infernoPositions,
            chickenPositions,
            hostagesPickUpStart,
            hostagesPickedUp,
            hostagePositions,
            bombsPlantStart,
            bombsDefuseStart,
            decoysStart,
            heGrenadesExplode,
            flashbangsExplode,
            smokesStart,
            bombExploded,
            bombPlanted,
            bombDefused,
            audioFilePath,
        };
        return payload;
    }
    catch (error) {
        handleError(error, 'Error while fetching 2D viewer data');
    }
}
//# sourceMappingURL=fetch-2d-viewer-data-handler.js.map