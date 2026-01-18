import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { Trans } from '@lingui/react/macro';
import { HistoryButton } from './history-button';
import { LeftArrowIcon } from 'csdm/ui/icons/left-arrow-icon';
export function HistoryBackButton() {
    const location = useLocation();
    const navigate = useNavigate();
    const [canGoBack, setCanGoBack] = useState(false);
    useEffect(() => {
        const onLocationChanged = async () => {
            const canGoBack = await window.csdm.canGoBack();
            setCanGoBack(canGoBack);
        };
        onLocationChanged();
    }, [location]);
    const onClick = () => {
        navigate(-1);
    };
    const isDisabled = !canGoBack;
    return (React.createElement(HistoryButton, { onClick: onClick, isDisabled: isDisabled, tooltip: React.createElement(Trans, { context: "Tooltip" }, "Back in history") },
        React.createElement(LeftArrowIcon, { height: 20 })));
}
//# sourceMappingURL=history-back-button.js.map