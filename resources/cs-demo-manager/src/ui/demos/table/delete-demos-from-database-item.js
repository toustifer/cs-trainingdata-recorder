import React from 'react';
import { Trans } from '@lingui/react/macro';
import { ContextMenuItem } from 'csdm/ui/components/context-menu/context-menu-item';
export function DeleteDemosFromDatabaseItem({ onClick }) {
    return (React.createElement(ContextMenuItem, { onClick: onClick },
        React.createElement(Trans, null, "Delete from database")));
}
//# sourceMappingURL=delete-demos-from-database-item.js.map