import { useWebSocketClient } from './use-web-socket-client';
import { RendererClientMessageName } from 'csdm/server/renderer-client-message-name';
import { useDispatch } from 'csdm/ui/store/use-dispatch';
import { updateMatchDemoLocationSuccess } from 'csdm/ui/match/match-actions';
import { useLingui } from '@lingui/react/macro';
export function useUpdateDemoLocation() {
    const { t } = useLingui();
    const client = useWebSocketClient();
    const dispatch = useDispatch();
    return async (checksum) => {
        const options = {
            title: t `Select demo's path`,
            filters: [{ name: '*', extensions: ['dem'] }],
            properties: ['openFile'],
        };
        const { canceled, filePaths } = await window.csdm.showOpenDialog(options);
        if (canceled || filePaths.length === 0) {
            return;
        }
        const [filePath] = filePaths;
        const payload = {
            checksum,
            demoFilePath: filePath,
        };
        await client.send({
            name: RendererClientMessageName.UpdateMatchDemoLocation,
            payload,
        });
        dispatch(updateMatchDemoLocationSuccess({
            checksum,
            demoFilePath: filePath,
        }));
        return filePath;
    };
}
//# sourceMappingURL=use-update-demo-location.js.map