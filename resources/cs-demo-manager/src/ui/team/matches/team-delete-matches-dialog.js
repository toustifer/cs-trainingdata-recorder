import React from 'react';
import { DeleteMatchesDialog } from 'csdm/ui/components/dialogs/delete-matches-dialog';
import { useFetchTeam } from '../use-fetch-team';
export function TeamDeleteMatchesDialog({ checksums }) {
    const fetchTeam = useFetchTeam();
    return (React.createElement(DeleteMatchesDialog, { checksums: checksums, onDeleteSuccess: () => {
            fetchTeam();
        } }));
}
//# sourceMappingURL=team-delete-matches-dialog.js.map