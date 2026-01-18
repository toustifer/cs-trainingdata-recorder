import React from 'react';
import { AnalyzeDemosButton } from 'csdm/ui/demos/action-bar/analyze-demos-button';
import { ActionBar } from 'csdm/ui/components/action-bar';
import { WatchDemoButton } from 'csdm/ui/demos/action-bar/watch-demo-button';
import { RefreshDemosButton } from 'csdm/ui/demos/action-bar/refresh-demos-button';
import { RevealDemosInExplorerButton } from 'csdm/ui/demos/action-bar/reveal-demos-in-explorer-button';
import { DemosColumnsVisibility } from 'csdm/ui/demos/table/demos-columns-visibility';
import { DemoDetailsButton } from 'csdm/ui/demos/action-bar/demo-details-button';
import { FuzzySearchTextInput } from 'csdm/ui/demos/action-bar/fuzzy-search-text-input';
import { DemosFilterDropdown } from 'csdm/ui/demos/action-bar/demos-filter-dropdown';
export function DemosActionBar() {
    return (React.createElement(ActionBar, { left: React.createElement(React.Fragment, null,
            React.createElement(DemoDetailsButton, null),
            React.createElement(WatchDemoButton, null),
            React.createElement(RevealDemosInExplorerButton, null),
            React.createElement(AnalyzeDemosButton, null)), right: React.createElement(React.Fragment, null,
            React.createElement(RefreshDemosButton, null),
            React.createElement(DemosColumnsVisibility, null),
            React.createElement(DemosFilterDropdown, null),
            React.createElement(FuzzySearchTextInput, null)) }));
}
//# sourceMappingURL=action-bar.js.map