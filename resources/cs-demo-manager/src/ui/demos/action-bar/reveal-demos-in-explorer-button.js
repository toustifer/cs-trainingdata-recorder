import React from 'react';
import { RevealDemoInExplorerButton } from 'csdm/ui/components/buttons/reveal-demo-in-explorer-button';
import { useSelectedDemos } from 'csdm/ui/demos/use-selected-demos';
import { useDemosLoaded } from 'csdm/ui/demos/use-demos-loaded';
import { lastArrayItem } from 'csdm/common/array/last-array-item';
export function RevealDemosInExplorerButton() {
    const selectedDemos = useSelectedDemos();
    const demosLoaded = useDemosLoaded();
    if (selectedDemos.length === 0) {
        return null;
    }
    const demoPath = lastArrayItem(selectedDemos).filePath;
    return React.createElement(RevealDemoInExplorerButton, { isDisabled: !demosLoaded, demoPath: demoPath });
}
//# sourceMappingURL=reveal-demos-in-explorer-button.js.map