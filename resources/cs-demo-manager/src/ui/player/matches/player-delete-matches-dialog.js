import React from 'react';
import { DeleteMatchesDialog } from 'csdm/ui/components/dialogs/delete-matches-dialog';
import { useFetchPlayer } from '../use-fetch-player';
export function PlayerDeleteMatchesDialog({ checksums }) {
    const fetchPlayer = useFetchPlayer();
    return (React.createElement(DeleteMatchesDialog, { checksums: checksums, onDeleteSuccess: () => {
            fetchPlayer();
        } }));
}
//# sourceMappingURL=player-delete-matches-dialog.js.map