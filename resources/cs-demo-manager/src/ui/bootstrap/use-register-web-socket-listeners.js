import { useRegisterAnalysesListeners } from './web-socket-listeners/use-register-analyses-listeners';
import { useRegisterBanListeners } from './web-socket-listeners/use-register-ban-listeners';
import { useRegisterDownloadsListeners } from './web-socket-listeners/use-register-downloads-listeners';
import { useRegisterSettingsListeners } from './web-socket-listeners/use-register-settings-listeners';
import { useRegisterVideoQueueListeners } from './web-socket-listeners/use-register-video-queue-listeners';
import { useRegisterCounterStrikeListeners } from './web-socket-listeners/use-register-counter-strike-listeners';
export function useRegisterWebSocketListeners(client) {
    useRegisterAnalysesListeners(client);
    useRegisterBanListeners(client);
    useRegisterDownloadsListeners(client);
    useRegisterSettingsListeners(client);
    useRegisterVideoQueueListeners(client);
    useRegisterCounterStrikeListeners(client);
}
//# sourceMappingURL=use-register-web-socket-listeners.js.map