import React, { useEffect, useState } from 'react';
import { Trans } from '@lingui/react/macro';
import { UpdateIcon } from 'csdm/ui/icons/update-icon';
import { Tooltip } from 'csdm/ui/components/tooltip';
export function UpdateAvailableButton() {
    const [updateAvailable, setUpdateAvailable] = useState(false);
    useEffect(() => {
        window.csdm.hasUpdateReadyToInstall().then(setUpdateAvailable);
    }, []);
    const onClick = () => {
        window.csdm.installUpdate();
    };
    useEffect(() => {
        const onUpdateDownloaded = () => {
            setUpdateAvailable(true);
        };
        const unListen = window.csdm.onUpdateDownloaded(onUpdateDownloaded);
        return () => {
            unListen();
        };
    }, []);
    if (!updateAvailable) {
        return null;
    }
    return (React.createElement("div", { className: "no-drag" },
        React.createElement(Tooltip, { content: React.createElement(Trans, null, "Update ready!"), placement: "bottom", delay: 0 },
            React.createElement("button", { className: "flex border border-transparent text-green-400 no-underline outline-hidden transition-all duration-85 hover:text-green-700", onClick: onClick },
                React.createElement(UpdateIcon, { className: "w-20" })))));
}
//# sourceMappingURL=update-available-button.js.map