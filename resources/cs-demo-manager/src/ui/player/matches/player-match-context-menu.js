import React from 'react';
import { NavigateToMatchesDemoItem } from 'csdm/ui/components/context-menu/items/navigate-to-matches-demo-item';
import { TagsItem } from '../../components/context-menu/items/tags-item';
import { ContextMenu } from 'csdm/ui/components/context-menu/context-menu';
import { NavigateToMatchItem } from 'csdm/ui/components/context-menu/items/navigate-to-match-item';
import { CopyChecksumsItem } from 'csdm/ui/components/context-menu/items/copy-checksums-item';
import { UpdateMatchDemoLocationItem } from 'csdm/ui/components/context-menu/items/update-match-demo-location-item';
import { Separator } from 'csdm/ui/components/context-menu/separator';
import { DeleteItem } from 'csdm/ui/components/context-menu/items/delete-item';
import { CommentItem } from 'csdm/ui/components/context-menu/items/comment-item';
import { RevealDemoInExplorerItem } from 'csdm/ui/components/context-menu/items/reveal-demo-in-explorer-item';
import { useDialog } from 'csdm/ui/components/dialogs/use-dialog';
import { UpdateDemoLocationDialog } from 'csdm/ui/dialogs/update-demo-location-dialog';
import { PlayerDeleteMatchesDialog } from './player-delete-matches-dialog';
import { ExportMatchesItem } from 'csdm/ui/components/context-menu/items/export-matches-item';
import { CopyItem } from 'csdm/ui/components/context-menu/items/copy-item';
import { CopyShareCodeItem } from 'csdm/ui/components/context-menu/items/copy-sharecode-item';
import { CopyFilepathItem } from 'csdm/ui/components/context-menu/items/copy-filepath-item';
import { ChangeMatchesTypeItem } from 'csdm/ui/components/context-menu/items/change-matches-type-item';
import { RenameItem } from 'csdm/ui/components/context-menu/items/rename-item';
import { RenameMatchDialog } from 'csdm/ui/matches/dialogs/rename-match-dialog';
import { WatchItem } from 'csdm/ui/components/context-menu/items/watch-item';
import { isCounterStrikeStartable } from 'csdm/ui/hooks/use-counter-strike';
import { MatchesTagsDialog } from 'csdm/ui/matches/dialogs/tags-dialog';
import { lastArrayItem } from 'csdm/common/array/last-array-item';
export function PlayerMatchContextMenu({ selectedMatches, matchChecksums, onCommentClick }) {
    const { showDialog } = useDialog();
    if (selectedMatches.length === 0) {
        return null;
    }
    const checksums = [];
    const shareCodes = [];
    const filepaths = [];
    for (const match of selectedMatches) {
        checksums.push(match.checksum);
        shareCodes.push(match.shareCode);
        filepaths.push(match.demoFilePath);
    }
    const selectedMatch = lastArrayItem(selectedMatches);
    const onTagsClick = () => {
        showDialog(React.createElement(MatchesTagsDialog, { matches: selectedMatches }));
    };
    const onDeleteClick = () => {
        showDialog(React.createElement(PlayerDeleteMatchesDialog, { checksums: checksums }));
    };
    const onRenameClick = () => {
        showDialog(React.createElement(RenameMatchDialog, { matches: selectedMatches }));
    };
    const onDemoNotFound = (demoPath, checksum) => {
        showDialog(React.createElement(UpdateDemoLocationDialog, { demoFilePath: demoPath, checksum: checksum }));
    };
    return (React.createElement(ContextMenu, null,
        React.createElement(NavigateToMatchItem, { checksum: selectedMatch.checksum, siblingChecksums: matchChecksums }),
        React.createElement(RevealDemoInExplorerItem, { demoPath: selectedMatch.demoFilePath, checksum: selectedMatch.checksum, onDemoNotFound: onDemoNotFound }),
        isCounterStrikeStartable(selectedMatch.game) && React.createElement(WatchItem, { demoPath: selectedMatch.demoFilePath }),
        React.createElement(CommentItem, { onClick: onCommentClick, isDisabled: selectedMatches.length !== 1 }),
        React.createElement(TagsItem, { onClick: onTagsClick }),
        React.createElement(Separator, null),
        React.createElement(ExportMatchesItem, { matches: selectedMatches }),
        React.createElement(Separator, null),
        React.createElement(CopyItem, null,
            React.createElement(CopyChecksumsItem, { checksums: checksums }),
            React.createElement(CopyShareCodeItem, { shareCodes: shareCodes }),
            React.createElement(CopyFilepathItem, { filepaths: filepaths })),
        React.createElement(Separator, null),
        React.createElement(ChangeMatchesTypeItem, { checksums: checksums }),
        React.createElement(Separator, null),
        React.createElement(NavigateToMatchesDemoItem, { matches: selectedMatches }),
        React.createElement(UpdateMatchDemoLocationItem, { matches: selectedMatches }),
        React.createElement(Separator, null),
        React.createElement(RenameItem, { onClick: onRenameClick }),
        React.createElement(DeleteItem, { onClick: onDeleteClick })));
}
//# sourceMappingURL=player-match-context-menu.js.map