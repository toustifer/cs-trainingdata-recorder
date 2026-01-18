import React from 'react';
import { Trans } from '@lingui/react/macro';
import { DemoField } from './demo-field';
import { useFormatDate } from 'csdm/ui/hooks/use-format-date';
export function DemoDate({ date }) {
    const formatDate = useFormatDate();
    return (React.createElement(DemoField, { label: React.createElement(Trans, null, "Date:"), value: formatDate(date, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
        }) }));
}
//# sourceMappingURL=demo-date.js.map