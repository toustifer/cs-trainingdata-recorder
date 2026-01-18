import { fetchMaps } from 'csdm/node/database/maps/fetch-maps';
import { fetchMatchChecksums } from 'csdm/node/database/matches/fetch-match-checksums';
import { downloadDemoQueue } from 'csdm/server/download-queue';
import { analysesListener } from 'csdm/server/analyses-listener';
import { fetchTags } from 'csdm/node/database/tags/fetch-tags';
import { fetchFaceitAccounts } from 'csdm/node/database/faceit-account/fetch-faceit-accounts';
import { startBackgroundTasks } from 'csdm/server/start-background-tasks';
import { fetchIgnoredSteamAccounts } from 'csdm/node/database/steam-accounts/fetch-ignored-steam-accounts';
import { initializeSettings } from 'csdm/node/settings/initialize-settings';
import { videoQueue } from 'csdm/server/video-queue';
import {} from 'csdm/common/types/video';
import { fetch5EPlayAccounts } from 'csdm/node/database/5play-account/fetch-5eplay-accounts';
import { fetchCameras } from 'csdm/node/database/cameras/fetch-cameras';
import { fetchRenownAccounts } from 'csdm/node/database/renown-account/fetch-renown-accounts';
export async function initializeApplicationHandler() {
    try {
        const [settings, maps, cameras, tags, matchChecksums, faceitAccounts, fiveEPlayAccounts, renownAccounts, ignoredSteamAccounts,] = await Promise.all([
            initializeSettings(),
            fetchMaps(),
            fetchCameras(),
            fetchTags(),
            fetchMatchChecksums(),
            fetchFaceitAccounts(),
            fetch5EPlayAccounts(),
            fetchRenownAccounts(),
            fetchIgnoredSteamAccounts(),
        ]);
        const payload = {
            maps,
            cameras,
            tags,
            matchChecksums,
            settings,
            faceitAccounts,
            fiveEPlayAccounts,
            renownAccounts,
            ignoredSteamAccounts,
            analyses: analysesListener.getAnalyses(),
            downloads: downloadDemoQueue.getDownloads(),
            videos: videoQueue.getVideos(),
        };
        startBackgroundTasks();
        return payload;
    }
    catch (error) {
        logger.error('App initialization error');
        logger.error(error);
        let errorMessage = 'Unknown error';
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        throw errorMessage;
    }
}
//# sourceMappingURL=initialize-application-handler.js.map