import { RendererClientMessageName } from 'csdm/server/renderer-client-message-name';
import { useWebSocketClient } from './use-web-socket-client';
export function useAddDemosToAnalyses() {
    const client = useWebSocketClient();
    return (demos) => {
        client.send({
            name: RendererClientMessageName.AddDemosToAnalyses,
            payload: demos,
        });
    };
}
//# sourceMappingURL=use-add-demos-to-analyses.js.map