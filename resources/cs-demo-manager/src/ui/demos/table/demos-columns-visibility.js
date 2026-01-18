import React from 'react';
import { useDemosLoaded } from 'csdm/ui/demos/use-demos-loaded';
import { ColumnsVisibilityDropdown } from 'csdm/ui/components/table/columns-visibility-dropdown';
import { useDemosTable } from 'csdm/ui/demos/table/use-demos-table';
export function DemosColumnsVisibility() {
    const demosLoaded = useDemosLoaded();
    const table = useDemosTable();
    return React.createElement(ColumnsVisibilityDropdown, { table: table, isDisabled: !demosLoaded });
}
//# sourceMappingURL=demos-columns-visibility.js.map