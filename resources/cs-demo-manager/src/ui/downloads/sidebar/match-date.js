import React from 'react';
import { useFormatDate } from 'csdm/ui/hooks/use-format-date';
export function MatchDate({ date }) {
    const formatDate = useFormatDate();
    const humanizedDate = formatDate(date, {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
    });
    return React.createElement("p", null, humanizedDate);
}
//# sourceMappingURL=match-date.js.map