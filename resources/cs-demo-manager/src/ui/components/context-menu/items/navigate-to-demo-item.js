import React from 'react';
import { useNavigateToDemo } from 'csdm/ui/hooks/use-navigate-to-demo';
import { DetailsItem } from './details-item';
export function NavigateToDemoItem({ demoPath, siblingDemoPaths }) {
    const navigateToDemo = useNavigateToDemo();
    const onClick = () => {
        navigateToDemo(demoPath, {
            state: {
                siblingDemoPaths,
            },
        });
    };
    return React.createElement(DetailsItem, { onClick: onClick });
}
//# sourceMappingURL=navigate-to-demo-item.js.map