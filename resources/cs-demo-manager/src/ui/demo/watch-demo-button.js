import React from 'react';
import { WatchButton } from 'csdm/ui/components/buttons/watch-button';
import { useCurrentDemo } from './use-current-demo';
export function WatchDemoButton() {
    const demo = useCurrentDemo();
    return React.createElement(WatchButton, { demoPath: demo.filePath, game: demo.game });
}
//# sourceMappingURL=watch-demo-button.js.map