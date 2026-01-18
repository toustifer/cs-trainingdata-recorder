import React from 'react';
import { Trans } from '@lingui/react/macro';
import { RevealFileInExplorerItem } from 'csdm/ui/components/context-menu/items/reveal-file-in-explorer-item';
import { useIsDemoAnalysisInProgress } from 'csdm/ui/analyses/use-is-demo-analysis-in-progress';
import { useIsDemoInDatabase } from 'csdm/ui/demo/use-is-demo-in-database';
import { TagsItem } from 'csdm/ui/components/context-menu/items/tags-item';
import { ContextMenu } from 'csdm/ui/components/context-menu/context-menu';
import { ContextMenuItem } from 'csdm/ui/components/context-menu/context-menu-item';
import { DeleteItem } from 'csdm/ui/components/context-menu/items/delete-item';
import { CommentItem } from 'csdm/ui/components/context-menu/items/comment-item';
import { NavigateToDemoItem } from 'csdm/ui/components/context-menu/items/navigate-to-demo-item';
import { CopyChecksumsItem } from 'csdm/ui/components/context-menu/items/copy-checksums-item';
import { ChangeSourceItem } from 'csdm/ui/components/context-menu/items/change-source-item';
import { useNavigateToMatch } from 'csdm/ui/hooks/use-navigate-to-match';
import { AnalyzeItem } from 'csdm/ui/components/context-menu/items/analyze-item';
import { CopyShareCodeItem } from 'csdm/ui/components/context-menu/items/copy-sharecode-item';
import { Separator } from 'csdm/ui/components/context-menu/separator';
import { RenameItem } from 'csdm/ui/components/context-menu/items/rename-item';
import { CopyFilepathItem } from 'csdm/ui/components/context-menu/items/copy-filepath-item';
import { DemosTagsDialog } from './tags-dialog';
import { useDialog } from 'csdm/ui/components/dialogs/use-dialog';
import { DeleteDemosDialog } from 'csdm/ui/components/dialogs/delete-demos-dialog';
import { DemoNotFoundDialog } from 'csdm/ui/components/dialogs/demo-not-found-dialog';
import { RenameDemoDialog } from './rename-demo-dialog';
import { ChangeDemosSourceDialog } from 'csdm/ui/components/dialogs/change-demos-source-dialog';
import { UpdateDemosTypeItem } from './update-demos-type-item';
import { CopyItem } from 'csdm/ui/components/context-menu/items/copy-item';
import { DeleteDemosFromDatabaseItem } from './delete-demos-from-database-item';
import { DeleteDemosFromDatabaseDialog } from 'csdm/ui/components/dialogs/delete-demos-from-database-dialog';
import { ExportDemosItem } from './export-demos-items';
import { lastArrayItem } from 'csdm/common/array/last-array-item';
function NavigateToMatchItem({ demos }) {
    const navigateToMatch = useNavigateToMatch();
    const isDemoAnalysisInProgress = useIsDemoAnalysisInProgress();
    const isDemoInDatabase = useIsDemoInDatabase();
    const isSeeMatchItemDisabled = () => {
        if (demos.length !== 1) {
            return true;
        }
        const [selectedDemo] = demos;
        return !isDemoInDatabase(selectedDemo.checksum) || isDemoAnalysisInProgress(selectedDemo.checksum);
    };
    const onClick = () => {
        navigateToMatch(demos[0].checksum);
    };
    return (React.createElement(ContextMenuItem, { onClick: onClick, isDisabled: isSeeMatchItemDisabled() },
        React.createElement(Trans, { context: "Context menu" }, "See match")));
}
export function DemoContextMenu({ onCommentClick, demos, siblingDemoPaths }) {
    const { showDialog } = useDialog();
    if (demos.length === 0) {
        return null;
    }
    const checksums = demos.map((demo) => demo.checksum);
    const filepaths = demos.map((demo) => demo.filePath);
    const selectedDemo = lastArrayItem(demos);
    const onTagsClick = () => {
        showDialog(React.createElement(DemosTagsDialog, { demos: demos }));
    };
    const onRenameClick = () => {
        showDialog(React.createElement(RenameDemoDialog, { demos: demos }));
    };
    const onDeleteClick = () => {
        showDialog(React.createElement(DeleteDemosDialog, { demos: demos }));
    };
    const onDeleteFromDatabaseClick = () => {
        showDialog(React.createElement(DeleteDemosFromDatabaseDialog, { checksums: checksums }));
    };
    const onChangeSourceClick = () => {
        const initialSource = demos.length === 1 ? demos[0].source : undefined;
        showDialog(React.createElement(ChangeDemosSourceDialog, { checksums: checksums, initialSource: initialSource }));
    };
    const onDemoNotFound = (demoPath) => {
        showDialog(React.createElement(DemoNotFoundDialog, { demoPath: demoPath }));
    };
    return (React.createElement(ContextMenu, null,
        React.createElement(NavigateToDemoItem, { demoPath: selectedDemo.filePath, siblingDemoPaths: siblingDemoPaths }),
        React.createElement(NavigateToMatchItem, { demos: demos }),
        React.createElement(AnalyzeItem, { demos: demos }),
        React.createElement(Separator, null),
        React.createElement(CommentItem, { onClick: onCommentClick, isDisabled: demos.length !== 1 }),
        React.createElement(TagsItem, { onClick: onTagsClick }),
        React.createElement(RenameItem, { onClick: onRenameClick }),
        React.createElement(ChangeSourceItem, { onClick: onChangeSourceClick }),
        React.createElement(UpdateDemosTypeItem, { checksums: checksums }),
        React.createElement(Separator, null),
        React.createElement(ExportDemosItem, { filepaths: filepaths }),
        React.createElement(Separator, null),
        React.createElement(CopyItem, null,
            React.createElement(CopyShareCodeItem, { shareCodes: demos.map((demo) => demo.shareCode) }),
            React.createElement(CopyChecksumsItem, { checksums: checksums }),
            React.createElement(CopyFilepathItem, { filepaths: filepaths })),
        React.createElement(Separator, null),
        React.createElement(RevealFileInExplorerItem, { filePath: selectedDemo.filePath, onFileNotFound: onDemoNotFound }),
        React.createElement(Separator, null),
        React.createElement(DeleteItem, { onClick: onDeleteClick }),
        React.createElement(DeleteDemosFromDatabaseItem, { onClick: onDeleteFromDatabaseClick })));
}
//# sourceMappingURL=demo-context-menu.js.map