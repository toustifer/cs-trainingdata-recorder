import { RendererClientMessageName } from 'csdm/server/renderer-client-message-name';
import { addDownloadHandler } from './renderer-process/download/add-download-handler';
import { addFaceitAccountHandler } from './renderer-process/faceit/add-faceit-account-handler';
import { initializeApplicationHandler, } from './renderer-process/initialize-application-handler';
import { fetchMatchesTableHandler } from './renderer-process/match/fetch-matches-table-handler';
import { fetchMatchByChecksumHandler } from './renderer-process/match/fetch-match-by-checksum-handler';
import { fetchMatchHeatmapPointsHandler } from './renderer-process/match/fetch-match-heatmap-points-handler';
import { fetch2DViewerDataHandler } from './renderer-process/match/fetch-2d-viewer-data-handler';
import { updateCommentHandler } from './renderer-process/match/update-comment-handler';
import { initializeVideoHandler } from './renderer-process/video/initialize-video-handler';
import { fetchDemosTableHandler } from './renderer-process/demo/fetch-demos-table-handler';
import { loadDemoHandler } from './renderer-process/demo/load-demo-handler';
import { navigateToDemoOrMatch } from './renderer-process/navigate-to-demo-or-match-handler';
import { addDemosToAnalysesHandler } from './renderer-process/demo/add-demos-to-analyses-handler';
import { removeDemosFromAnalysesHandler } from './renderer-process/demo/remove-demos-from-analyses-handler';
import { deleteMatchesHandler } from './renderer-process/match/delete-matches-handler';
import { deleteIgnoredSteamAccountHandler } from './renderer-process/steam-accounts/delete-ignored-steam-account-handler';
import { fetchLastValveMatchesHandler } from './renderer-process/download/fetch-last-valve-matches-handler';
import { abortDownloadHandler } from './renderer-process/download/abort-download-handler';
import { addDownloadsHandler } from './renderer-process/download/add-downloads-handler';
import { addDownloadFromShareCodeHandler } from './renderer-process/download/add-download-from-share-code-handler';
import { deleteDemosHandler } from './renderer-process/demo/delete-demos-handler';
import { exportMatchesToXlsxHandler } from './renderer-process/match/export-matches-to-xlsx-handler';
import { addIgnoredSteamAccountHandler } from './renderer-process/steam-accounts/add-ignored-steam-account-handler';
import { addMapHandler } from './renderer-process/map/add-map-handler';
import { updateMapHandler } from './renderer-process/map/update-map-handler';
import { deleteMapHandler } from './renderer-process/map/delete-map-handler';
import { fetchBanStatsHandler } from './renderer-process/bans/fetch-ban-stats-handler';
import { disconnectDatabaseConnectionHandler } from './renderer-process/database/disconnect-database-connection-handler';
import { connectDatabaseHandler, } from './renderer-process/database/connect-database-handler';
import { addVideoToQueueHandler } from './renderer-process/video/add-video-to-queue-handler';
import { updateMatchDemoLocationHandler } from './renderer-process/match/update-match-demo-location-handler';
import { installHlaeHandler } from './renderer-process/video/install-hlae-handler';
import { updateHlaeHandler } from './renderer-process/video/update-hlae-handler';
import { installVirtualDubHandler } from './renderer-process/video/install-virtual-dub-handler';
import { installFfmpegHandler } from './renderer-process/video/install-ffmpeg-handler';
import { updateFfmpegHandler } from './renderer-process/video/update-ffmpeg-handler';
import { removeVideosFromQueueHandler } from './renderer-process/video/remove-videos-from-queue-handler';
import { fetchMatchGrenadesThrowHandler } from './renderer-process/match/fetch-match-grenades-throw-handler';
import { getDatabaseSizeHandler } from './renderer-process/database/get-database-size-handler';
import { optimizeDatabaseHandler } from './renderer-process/database/optimize-database-handler';
import { fetchPlayersHandler } from './renderer-process/player/fetch-players-table-handler';
import { watchDemoHandler } from './renderer-process/counter-strike/watch-demo-handler';
import { watchPlayerHighlightsHandler, } from './renderer-process/counter-strike/watch-player-highlights-handler';
import { watchPlayerLowlightsHandler, } from './renderer-process/counter-strike/watch-player-lowlights-handler';
import { exportMatchChatMessagesHandler } from './renderer-process/match/export-match-chat-messages-handler';
import { writeBase64FileHandler } from './renderer-process/filesystem/write-base64-file-handler';
import { updateDemosSourceHandler } from './renderer-process/demo/update-demos-source-handler';
import { fetchPlayerHandler } from './renderer-process/player/fetch-player-handler';
import { resetDatabaseHandler } from './renderer-process/database/reset-database-handler';
import { updateTagHandler } from './renderer-process/tags/update-tag-handler';
import { deleteTagHandler } from './renderer-process/tags/delete-tag-handler';
import { insertTagHandler } from './renderer-process/tags/insert-tag-handler';
import { updateChecksumsTagsHandler } from './renderer-process/tags/update-checksums-tags-handler';
import { isCounterStrikeRunningHandler } from './renderer-process/counter-strike/is-counter-strike-running-handler';
import { resetMapsHandler } from './renderer-process/map/reset-maps-handler';
import { resetTablesStateHandler } from './renderer-process/settings/reset-tables-state-handler';
import { enableFfmpegCustomLocationHandler } from './renderer-process/settings/enable-ffmpeg-custom-location-handler';
import { disableFfmpegCustomLocationHandler } from './renderer-process/settings/disable-ffmpeg-custom-location-handler';
import { enableHlaeCustomLocationHandler } from './renderer-process/settings/enable-hlae-custom-location-handler';
import { disableHlaeCustomLocationHandler } from './renderer-process/settings/disable-hlae-custom-location-handler';
import { fetchLastFaceitMatchesHandler } from './renderer-process/faceit/fetch-last-faceit-matches-handler';
import { updateCurrentFaceitAccountHandler } from './renderer-process/faceit/update-current-faceit-account-handler';
import { deleteFaceitAccountHandler } from './renderer-process/faceit/delete-faceit-account-handler';
import { abortDownloadsHandler } from './renderer-process/download/abort-downloads-handler';
import { renameDemoHandler } from './renderer-process/demo/rename-demo-handler';
import { exportDemoPlayersVoiceHandler } from './renderer-process/demo/export-demo-players-voice-handler';
import { updateDemosTypeHandler } from './renderer-process/demo/update-demos-type-handler';
import { updateMatchesTypeHandler } from './renderer-process/match/update-matches-type-handler';
import { searchHandler } from './renderer-process/search/search-handler';
import { searchPlayersHandler } from './renderer-process/search/search-players-handler';
import { searchMapNamesHandler } from './renderer-process/search/search-map-names-handler';
import { exportMatchesToJsonHandler, } from './renderer-process/match/export-matches-to-json-handler';
import { watchPlayerAsSuspectHandler, } from './renderer-process/counter-strike/watch-player-as-suspect-handler';
import { generateMatchPositionsHandler, } from './renderer-process/match/generate-match-positions-handler';
import { updatePlayerCommentHandler, } from './renderer-process/player/update-player-comment-handler';
import { isCs2ConnectedToServerHandler } from './renderer-process/counter-strike/is-cs2-connected-to-server-handler';
import { fetchMigrationsHandler } from './renderer-process/migrations/fetch-migrations-handler';
import { deleteDemosFromDatabaseHandler } from './renderer-process/demo/delete-demos-from-database-handler';
import { watchPlayerRoundsHandler, } from './renderer-process/counter-strike/watch-player-rounds-handler';
import { updateRoundTagsHandler } from './renderer-process/tags/update-round-tags-handler';
import { fetchMatchFlashbangMatrixRowsHandler } from './renderer-process/match/fetch-match-flashbang-matrix-rows-handler';
import { importDataFromV2BackupHandler } from './renderer-process/database/import-data-from-v2-backup-handler';
import { fetchMatchDuelsMatrixRowsHandler } from './renderer-process/match/fetch-match-duels-matrix-rows-handler';
import { fetchTeamsTableHandler } from './renderer-process/team/fetch-teams-table-handler';
import { fetchTeamHandler } from './renderer-process/team/fetch-team-handler';
import { fetchTeamHeatmapPointsHandler } from './renderer-process/team/fetch-team-heatmap-points-handler';
import { updateMatchesTeamNamesHandler, } from './renderer-process/match/update-matches-team-names-handler';
import { abortCurrentTaskHandler } from './renderer-process/abort-current-task-handler';
import { updatePlayersTagsHandler, } from './renderer-process/tags/update-players-tags-handler';
import { updateSteamAccountNameHandler, } from './renderer-process/steam-accounts/update-steam-account-name-handler';
import { startCounterStrikeHandler, } from './renderer-process/counter-strike/start-counter-strike-handler';
import { resumeVideoQueueHandler } from './renderer-process/video/resume-video-queue-handler';
import { pauseVideoQueueHandler } from './renderer-process/video/pause-video-queue-handler';
import { add5EPlayAccountHandler } from './renderer-process/5eplay/add-5eplay-account-handler';
import { updateCurrent5EPlayAccountHandler } from './renderer-process/5eplay/update-current-5eplay-account-handler';
import { fetchLast5EPlayMatchesHandler } from './renderer-process/5eplay/fetch-last-5eplay-matches-handler';
import { delete5EPlayAccountHandler } from './renderer-process/5eplay/delete-5eplay-account-handler';
import { exportMatchesChatMessagesHandler, } from './renderer-process/match/export-matches-chat-messages-handler';
import { exportPlayersToXlsxHandler, } from './renderer-process/player/export-players-to-xlsx-handler';
import { watchVideoSequencesHandler } from './renderer-process/video/watch-video-sequences-handler';
import { updateRoundCommentHandler, } from './renderer-process/round/update-round-comment-handler';
import { addCameraHandler } from './renderer-process/cameras/add-camera-handler';
import { updateCameraHandler } from './renderer-process/cameras/update-camera-handler';
import { deleteCameraHandler } from './renderer-process/cameras/delete-camera-handler';
import { capturePlayerViewHandler } from './renderer-process/counter-strike/capture-player-view-handler';
import { fetchPlayerHeatmapPointsHandler } from './renderer-process/player/fetch-player-heatmap-points-handler';
import { addRenownAccountHandler } from './renderer-process/renown/add-renown-account-handler';
import { deleteRenownAccountHandler } from './renderer-process/renown/delete-renown-account-handler';
import { updateCurrentRenownAccountHandler } from './renderer-process/renown/update-current-renown-account-handler';
import { fetchLastRenownMatchesHandler } from './renderer-process/renown/fetch-last-renown-matches-handler';
// Mapping between message names and server handlers sent from the Electron renderer process to the WebSocket server.
export const rendererHandlers = {
    [RendererClientMessageName.InitializeApplication]: initializeApplicationHandler,
    [RendererClientMessageName.IsCs2ConnectedToServer]: isCs2ConnectedToServerHandler,
    [RendererClientMessageName.AbortCurrentTask]: abortCurrentTaskHandler,
    [RendererClientMessageName.GetDatabaseSize]: getDatabaseSizeHandler,
    [RendererClientMessageName.ResetDatabase]: resetDatabaseHandler,
    [RendererClientMessageName.OptimizeDatabase]: optimizeDatabaseHandler,
    [RendererClientMessageName.FetchMatchesTable]: fetchMatchesTableHandler,
    [RendererClientMessageName.FetchMatchByChecksum]: fetchMatchByChecksumHandler,
    [RendererClientMessageName.FetchMatchHeatmapPoints]: fetchMatchHeatmapPointsHandler,
    [RendererClientMessageName.FetchTeamHeatmapPoints]: fetchTeamHeatmapPointsHandler,
    [RendererClientMessageName.FetchPlayerHeatmapPoints]: fetchPlayerHeatmapPointsHandler,
    [RendererClientMessageName.Fetch2DViewerData]: fetch2DViewerDataHandler,
    [RendererClientMessageName.UpdateComment]: updateCommentHandler,
    [RendererClientMessageName.UpdatePlayerComment]: updatePlayerCommentHandler,
    [RendererClientMessageName.UpdateRoundComment]: updateRoundCommentHandler,
    [RendererClientMessageName.InitializeVideo]: initializeVideoHandler,
    [RendererClientMessageName.FetchDemosTable]: fetchDemosTableHandler,
    [RendererClientMessageName.LoadDemoByPath]: loadDemoHandler,
    [RendererClientMessageName.NavigateToDemoOrMatch]: navigateToDemoOrMatch,
    [RendererClientMessageName.FetchPlayersTable]: fetchPlayersHandler,
    [RendererClientMessageName.FetchTeamsTable]: fetchTeamsTableHandler,
    [RendererClientMessageName.FetchTeam]: fetchTeamHandler,
    [RendererClientMessageName.AddDemosToAnalyses]: addDemosToAnalysesHandler,
    [RendererClientMessageName.RemoveDemosFromAnalyses]: removeDemosFromAnalysesHandler,
    [RendererClientMessageName.GenerateMatchPositions]: generateMatchPositionsHandler,
    [RendererClientMessageName.RenameDemo]: renameDemoHandler,
    [RendererClientMessageName.DeleteMatches]: deleteMatchesHandler,
    [RendererClientMessageName.DeleteIgnoredSteamAccount]: deleteIgnoredSteamAccountHandler,
    [RendererClientMessageName.FetchLastValveMatches]: fetchLastValveMatchesHandler,
    [RendererClientMessageName.AbortDownload]: abortDownloadHandler,
    [RendererClientMessageName.AbortDownloads]: abortDownloadsHandler,
    [RendererClientMessageName.AddDownload]: addDownloadHandler,
    [RendererClientMessageName.AddDownloads]: addDownloadsHandler,
    [RendererClientMessageName.AddDownloadFromShareCode]: addDownloadFromShareCodeHandler,
    [RendererClientMessageName.DeleteDemos]: deleteDemosHandler,
    [RendererClientMessageName.UpdateDemosType]: updateDemosTypeHandler,
    [RendererClientMessageName.UpdateDemosSource]: updateDemosSourceHandler,
    [RendererClientMessageName.ExportDemoPlayersVoice]: exportDemoPlayersVoiceHandler,
    [RendererClientMessageName.UpdateMatchesType]: updateMatchesTypeHandler,
    [RendererClientMessageName.UpdateMatchesTeamNames]: updateMatchesTeamNamesHandler,
    [RendererClientMessageName.UpdateSteamAccountName]: updateSteamAccountNameHandler,
    [RendererClientMessageName.ExportMatchesToXlsx]: exportMatchesToXlsxHandler,
    [RendererClientMessageName.ExportMatchesToJson]: exportMatchesToJsonHandler,
    [RendererClientMessageName.ExportPlayersToXlsx]: exportPlayersToXlsxHandler,
    [RendererClientMessageName.AddIgnoredSteamAccount]: addIgnoredSteamAccountHandler,
    [RendererClientMessageName.AddMap]: addMapHandler,
    [RendererClientMessageName.UpdateMap]: updateMapHandler,
    [RendererClientMessageName.DeleteMap]: deleteMapHandler,
    [RendererClientMessageName.AddCamera]: addCameraHandler,
    [RendererClientMessageName.UpdateCamera]: updateCameraHandler,
    [RendererClientMessageName.DeleteCamera]: deleteCameraHandler,
    [RendererClientMessageName.FetchBanStats]: fetchBanStatsHandler,
    [RendererClientMessageName.DisconnectDatabase]: disconnectDatabaseConnectionHandler,
    [RendererClientMessageName.ConnectDatabase]: connectDatabaseHandler,
    [RendererClientMessageName.AddVideoToQueue]: addVideoToQueueHandler,
    [RendererClientMessageName.ResumeVideoQueue]: resumeVideoQueueHandler,
    [RendererClientMessageName.PauseVideoQueue]: pauseVideoQueueHandler,
    [RendererClientMessageName.UpdateMatchDemoLocation]: updateMatchDemoLocationHandler,
    [RendererClientMessageName.InstallHlae]: installHlaeHandler,
    [RendererClientMessageName.UpdateHlae]: updateHlaeHandler,
    [RendererClientMessageName.EnableHlaeCustomLocation]: enableHlaeCustomLocationHandler,
    [RendererClientMessageName.DisableHlaeCustomLocation]: disableHlaeCustomLocationHandler,
    [RendererClientMessageName.InstallVirtualDub]: installVirtualDubHandler,
    [RendererClientMessageName.InstallFfmpeg]: installFfmpegHandler,
    [RendererClientMessageName.UpdateFfmpeg]: updateFfmpegHandler,
    [RendererClientMessageName.EnableFfmpegCustomLocation]: enableFfmpegCustomLocationHandler,
    [RendererClientMessageName.DisableFfmpegCustomLocation]: disableFfmpegCustomLocationHandler,
    [RendererClientMessageName.RemoveVideosFromQueue]: removeVideosFromQueueHandler,
    [RendererClientMessageName.FetchMatchFlashbangMatrixRows]: fetchMatchFlashbangMatrixRowsHandler,
    [RendererClientMessageName.FetchMatchDuelsMatrixRows]: fetchMatchDuelsMatrixRowsHandler,
    [RendererClientMessageName.FetchMatchGrenadesThrow]: fetchMatchGrenadesThrowHandler,
    [RendererClientMessageName.StartCounterStrike]: startCounterStrikeHandler,
    [RendererClientMessageName.WatchDemo]: watchDemoHandler,
    [RendererClientMessageName.WatchPlayerRounds]: watchPlayerRoundsHandler,
    [RendererClientMessageName.WatchPlayerHighlights]: watchPlayerHighlightsHandler,
    [RendererClientMessageName.WatchPlayerLowlights]: watchPlayerLowlightsHandler,
    [RendererClientMessageName.WatchPlayerAsSuspect]: watchPlayerAsSuspectHandler,
    [RendererClientMessageName.ExportMatchChatMessages]: exportMatchChatMessagesHandler,
    [RendererClientMessageName.ExportMatchesChatMessages]: exportMatchesChatMessagesHandler,
    [RendererClientMessageName.WriteBase64File]: writeBase64FileHandler,
    [RendererClientMessageName.FetchPlayerStats]: fetchPlayerHandler,
    [RendererClientMessageName.InsertTag]: insertTagHandler,
    [RendererClientMessageName.UpdateTag]: updateTagHandler,
    [RendererClientMessageName.DeleteTag]: deleteTagHandler,
    [RendererClientMessageName.UpdateChecksumTags]: updateChecksumsTagsHandler,
    [RendererClientMessageName.UpdatePlayersTags]: updatePlayersTagsHandler,
    [RendererClientMessageName.UpdateRoundTags]: updateRoundTagsHandler,
    [RendererClientMessageName.IsCsRunning]: isCounterStrikeRunningHandler,
    [RendererClientMessageName.ResetMaps]: resetMapsHandler,
    [RendererClientMessageName.ResetTablesState]: resetTablesStateHandler,
    [RendererClientMessageName.FetchLastFaceitMatches]: fetchLastFaceitMatchesHandler,
    [RendererClientMessageName.AddFaceitAccount]: addFaceitAccountHandler,
    [RendererClientMessageName.UpdateCurrentFaceitAccount]: updateCurrentFaceitAccountHandler,
    [RendererClientMessageName.DeleteFaceitAccount]: deleteFaceitAccountHandler,
    [RendererClientMessageName.SearchEvent]: searchHandler,
    [RendererClientMessageName.SearchPlayers]: searchPlayersHandler,
    [RendererClientMessageName.SearchMaps]: searchMapNamesHandler,
    [RendererClientMessageName.FetchLastMigrations]: fetchMigrationsHandler,
    [RendererClientMessageName.DeleteDemosFromDatabase]: deleteDemosFromDatabaseHandler,
    [RendererClientMessageName.ImportDataFromV2Backup]: importDataFromV2BackupHandler,
    [RendererClientMessageName.FetchLast5EPlayMatches]: fetchLast5EPlayMatchesHandler,
    [RendererClientMessageName.Add5EPlayAccount]: add5EPlayAccountHandler,
    [RendererClientMessageName.Delete5EPlayAccount]: delete5EPlayAccountHandler,
    [RendererClientMessageName.UpdateCurrent5EPlayAccount]: updateCurrent5EPlayAccountHandler,
    [RendererClientMessageName.FetchLastRenownMatches]: fetchLastRenownMatchesHandler,
    [RendererClientMessageName.AddRenownAccount]: addRenownAccountHandler,
    [RendererClientMessageName.DeleteRenownAccount]: deleteRenownAccountHandler,
    [RendererClientMessageName.UpdateCurrentRenownAccount]: updateCurrentRenownAccountHandler,
    [RendererClientMessageName.WatchVideoSequences]: watchVideoSequencesHandler,
    [RendererClientMessageName.CapturePlayerView]: capturePlayerViewHandler,
};
//# sourceMappingURL=renderer-handlers-mapping.js.map