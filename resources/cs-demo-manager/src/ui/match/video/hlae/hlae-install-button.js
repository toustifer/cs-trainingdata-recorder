import React, { useState } from 'react';
import { Trans } from '@lingui/react/macro';
import { useIsHlaeInstalled } from 'csdm/ui/match/video/hlae/use-is-hlae-installed';
import { InstallButton } from 'csdm/ui/components/buttons/install-button';
import { RendererClientMessageName } from 'csdm/server/renderer-client-message-name';
import { useWebSocketClient } from 'csdm/ui/hooks/use-web-socket-client';
import { useShowToast } from 'csdm/ui/components/toasts/use-show-toast';
import { useDispatch } from 'csdm/ui/store/use-dispatch';
import { installHlaeSuccess } from './hlae-actions';
export function HlaeInstallButton() {
    const client = useWebSocketClient();
    const showToast = useShowToast();
    const dispatch = useDispatch();
    const isHlaeInstalled = useIsHlaeInstalled();
    const [isInstalling, setIsInstalling] = useState(false);
    const onClick = async () => {
        try {
            showToast({
                content: React.createElement(Trans, null, "Installing HLAE\u2026"),
                id: 'hlae-installation',
            });
            setIsInstalling(true);
            const version = await client.send({
                name: RendererClientMessageName.InstallHlae,
            });
            dispatch(installHlaeSuccess({ version }));
            showToast({
                content: React.createElement(Trans, null, "HLAE has been installed"),
                id: 'hlae-installation',
                type: 'success',
            });
        }
        catch (error) {
            showToast({
                content: React.createElement(Trans, null, "An error occurred while installing HLAE"),
                id: 'hlae-installation',
                type: 'error',
            });
        }
        finally {
            setIsInstalling(false);
        }
    };
    return React.createElement(InstallButton, { isDisabled: isHlaeInstalled, isInstalling: isInstalling, onClick: onClick });
}
//# sourceMappingURL=hlae-install-button.js.map