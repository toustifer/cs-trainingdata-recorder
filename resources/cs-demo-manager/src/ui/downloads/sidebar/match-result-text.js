import React, {} from 'react';
import { Trans } from '@lingui/react/macro';
import clsx from 'clsx';
import { MatchResult } from 'csdm/ui/downloads/match-result';
import { assertNever } from 'csdm/common/assert-never';
export function MatchResultText({ result }) {
    let text;
    let className;
    switch (result) {
        case MatchResult.Defeat:
            text = React.createElement(Trans, null, "Defeat");
            className = 'text-red-400';
            break;
        case MatchResult.Victory:
            text = React.createElement(Trans, null, "Victory");
            className = 'text-green-400';
            break;
        case MatchResult.Tied:
            text = React.createElement(Trans, null, "Tied");
            className = 'text-blue-400';
            break;
        case MatchResult.Unplayed:
            text = React.createElement(Trans, null, "Unplayed");
            className = 'text-gray-800';
            break;
        default:
            assertNever(result, 'Unknown match result');
    }
    return React.createElement("p", { className: clsx(`text-caption ${className}`) }, text);
}
//# sourceMappingURL=match-result-text.js.map