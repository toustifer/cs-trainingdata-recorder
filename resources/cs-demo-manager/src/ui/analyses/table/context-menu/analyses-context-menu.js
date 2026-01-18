import React from 'react';
import { useSelectedAnalysis } from 'csdm/ui/analyses/use-selected-analysis-demo-id';
import { ContextMenu } from 'csdm/ui/components/context-menu/context-menu';
import { RevealFileInExplorerItem } from 'csdm/ui/components/context-menu/items/reveal-file-in-explorer-item';
import { Separator } from 'csdm/ui/components/context-menu/separator';
import { RemoveDemoFromAnalysesItem } from './remove-demo-from-analyses-item';
import { SeeDemoItem } from './see-demo-item';
import { SeeMatchItem } from './see-match-item';
import { useDialog } from 'csdm/ui/components/dialogs/use-dialog';
import { DemoNotFoundDialog } from 'csdm/ui/components/dialogs/demo-not-found-dialog';
export function AnalysesContextMenu() {
    const selectedAnalysis = useSelectedAnalysis();
    const { showDialog } = useDialog();
    if (selectedAnalysis === undefined) {
        return null;
    }
    const onDemoNotFound = (demoPath) => {
        showDialog(React.createElement(DemoNotFoundDialog, { demoPath: demoPath }));
    };
    return (React.createElement(ContextMenu, null,
        React.createElement(SeeMatchItem, null),
        React.createElement(SeeDemoItem, null),
        React.createElement(RevealFileInExplorerItem, { filePath: selectedAnalysis.demoPath, onFileNotFound: onDemoNotFound }),
        React.createElement(Separator, null),
        React.createElement(RemoveDemoFromAnalysesItem, null)));
}
//# sourceMappingURL=analyses-context-menu.js.map