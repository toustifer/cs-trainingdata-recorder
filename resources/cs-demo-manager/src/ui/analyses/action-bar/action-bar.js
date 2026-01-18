import React from 'react';
import { ActionBar } from 'csdm/ui/components/action-bar';
import { RemoveAnalysesSucceedButton } from './remove-analyses-succeed-button';
import { RemoveAllAnalysesButton } from './remove-all-analyses-button';
export function AnalysesActionBar() {
    return (React.createElement(ActionBar, { left: React.createElement(React.Fragment, null,
            React.createElement(RemoveAllAnalysesButton, null),
            React.createElement(RemoveAnalysesSucceedButton, null)) }));
}
//# sourceMappingURL=action-bar.js.map