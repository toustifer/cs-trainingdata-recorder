import React from 'react';
import { RevealDemoInExplorerButton as RevealDemoInExplorerCommonButton } from 'csdm/ui/components/buttons/reveal-demo-in-explorer-button';
import { useCurrentDemo } from './use-current-demo';
export function RevealDemoInExplorerButton() {
    const demo = useCurrentDemo();
    return React.createElement(RevealDemoInExplorerCommonButton, { demoPath: demo.filePath });
}
//# sourceMappingURL=reveal-demo-in-explorer-button.js.map