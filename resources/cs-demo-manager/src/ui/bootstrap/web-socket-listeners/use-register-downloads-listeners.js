import { useEffect } from 'react';
import { RendererServerMessageName } from 'csdm/server/renderer-server-message-name';
import { currentSteamIdDetected, fetchLastMatchesError as fetchLastValveMatchesError, fetchLastMatchesSuccess as fetchLastValveMatchesSuccess, fetchLastMatchesStart as fetchLastValveMatchesStart, } from 'csdm/ui/downloads/valve/valve-actions';
import { demoDownloadedInCurrentFolderLoaded, downloadDemoCorrupted, downloadDemoError, downloadDemoExpired, downloadDemoProgressChanged, downloadDemoSuccess, downloadsAdded, } from 'csdm/ui/downloads/downloads-actions';
import { useDispatch } from '../../store/use-dispatch';
function useRegisterFetchLastValveMatchesListeners(client) {
    const dispatch = useDispatch();
    useEffect(() => {
        const onStart = () => {
            dispatch(fetchLastValveMatchesStart());
        };
        const onSuccess = (matches) => {
            dispatch(fetchLastValveMatchesSuccess({ matches }));
        };
        const onError = (errorCode) => {
            dispatch(fetchLastValveMatchesError({ errorCode }));
        };
        const onSteamIdDetected = (steamId) => {
            dispatch(currentSteamIdDetected({ steamId }));
        };
        client.on(RendererServerMessageName.FetchLastValveMatchesStart, onStart);
        client.on(RendererServerMessageName.FetchLastValveMatchesSuccess, onSuccess);
        client.on(RendererServerMessageName.FetchLastValveMatchesError, onError);
        client.on(RendererServerMessageName.FetchLastValveMatchesSteamIdDetected, onSteamIdDetected);
        return () => {
            client.off(RendererServerMessageName.FetchLastValveMatchesStart, onStart);
            client.off(RendererServerMessageName.FetchLastValveMatchesSuccess, onSuccess);
            client.off(RendererServerMessageName.FetchLastValveMatchesError, onError);
            client.off(RendererServerMessageName.FetchLastValveMatchesSteamIdDetected, onSteamIdDetected);
        };
    });
}
export function useRegisterDownloadsListeners(client) {
    const dispatch = useDispatch();
    useEffect(() => {
        const onDownloadsAdded = (downloads) => {
            dispatch(downloadsAdded({ downloads }));
        };
        client.on(RendererServerMessageName.DownloadsAdded, onDownloadsAdded);
        const onDownloadProgress = ({ matchId, progress }) => {
            dispatch(downloadDemoProgressChanged({ matchId, progress }));
        };
        client.on(RendererServerMessageName.DownloadDemoProgress, onDownloadProgress);
        const onDemoExpired = (matchId) => {
            dispatch(downloadDemoExpired({ matchId }));
        };
        client.on(RendererServerMessageName.DownloadDemoExpired, onDemoExpired);
        const onDownloadDemoSuccess = (payload) => {
            dispatch(downloadDemoSuccess(payload));
        };
        client.on(RendererServerMessageName.DownloadDemoSuccess, onDownloadDemoSuccess);
        const onDownloadDemoCorrupted = (matchId) => {
            dispatch(downloadDemoCorrupted({ matchId }));
        };
        client.on(RendererServerMessageName.DownloadDemoCorrupted, onDownloadDemoCorrupted);
        const onDownloadDemoError = (matchId) => {
            dispatch(downloadDemoError({ matchId }));
        };
        client.on(RendererServerMessageName.DownloadDemoError, onDownloadDemoError);
        const onDownloadedDemoInCurrentFolderLoaded = (demo) => {
            dispatch(demoDownloadedInCurrentFolderLoaded(demo));
        };
        client.on(RendererServerMessageName.DownloadDemoInCurrentFolderLoaded, onDownloadedDemoInCurrentFolderLoaded);
        return () => {
            client.off(RendererServerMessageName.DownloadsAdded, onDownloadsAdded);
            client.off(RendererServerMessageName.DownloadDemoProgress, onDownloadProgress);
            client.off(RendererServerMessageName.DownloadDemoExpired, onDemoExpired);
            client.off(RendererServerMessageName.DownloadDemoSuccess, onDownloadDemoSuccess);
            client.off(RendererServerMessageName.DownloadDemoCorrupted, onDownloadDemoCorrupted);
            client.off(RendererServerMessageName.DownloadDemoError, onDownloadDemoError);
            client.off(RendererServerMessageName.DownloadDemoInCurrentFolderLoaded, onDownloadedDemoInCurrentFolderLoaded);
        };
    });
    useRegisterFetchLastValveMatchesListeners(client);
}
//# sourceMappingURL=use-register-downloads-listeners.js.map