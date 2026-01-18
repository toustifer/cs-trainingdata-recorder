import React from 'react';
import { Trans } from '@lingui/react/macro';
import { Button } from 'csdm/ui/components/buttons/button';
import { ResetHeatmapZoom } from './heatmap-events';
export function ResetZoomButton() {
    const onClick = () => {
        window.dispatchEvent(new ResetHeatmapZoom());
    };
    return (React.createElement(Button, { onClick: onClick },
        React.createElement(Trans, { context: "Button" }, "Reset zoom")));
}
//# sourceMappingURL=reset-zoom-button.js.map