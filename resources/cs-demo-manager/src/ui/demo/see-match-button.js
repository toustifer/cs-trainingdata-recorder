import React, {} from 'react';
import { Trans } from '@lingui/react/macro';
import { Button, ButtonVariant } from 'csdm/ui/components/buttons/button';
import { useIsDemoAnalysisInProgress } from 'csdm/ui/analyses/use-is-demo-analysis-in-progress';
import { useCurrentDemo } from './use-current-demo';
import { useIsDemoInDatabase } from './use-is-demo-in-database';
import { useNavigateToMatch } from 'csdm/ui/hooks/use-navigate-to-match';
import { Tooltip } from 'csdm/ui/components/tooltip';
export function SeeMatchButton() {
    const navigateToMatch = useNavigateToMatch();
    const isDemoAnalysisInProgress = useIsDemoAnalysisInProgress();
    const demo = useCurrentDemo();
    const isDemoInDatabase = useIsDemoInDatabase();
    const onClick = () => {
        navigateToMatch(demo.checksum);
    };
    let isDisabled = false;
    let tooltip;
    if (isDemoAnalysisInProgress(demo.checksum)) {
        isDisabled = true;
        tooltip = React.createElement(Trans, { context: "Tooltip" }, "Demo analysis in progress.");
    }
    else if (!isDemoInDatabase(demo.checksum)) {
        isDisabled = true;
        tooltip = React.createElement(Trans, { context: "Tooltip" }, "This demo has not been analyzed yet.");
    }
    const button = (React.createElement(Button, { onClick: onClick, variant: ButtonVariant.Primary, isDisabled: isDisabled },
        React.createElement(Trans, { context: "Button" }, "See match")));
    if (isDisabled) {
        return React.createElement(Tooltip, { content: tooltip }, button);
    }
    return button;
}
//# sourceMappingURL=see-match-button.js.map