import React from 'react';
import { Trans } from '@lingui/react/macro';
import { DemoField } from './demo-field';
import { useGetDemoSourceName } from 'csdm/ui/demos/use-demo-sources';
export function Source({ source }) {
    const getDemoSourceName = useGetDemoSourceName();
    return React.createElement(DemoField, { label: React.createElement(Trans, null, "Source:"), value: getDemoSourceName(source) });
}
//# sourceMappingURL=demo-source.js.map