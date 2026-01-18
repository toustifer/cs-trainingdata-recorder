import React from 'react';
import { Plural } from '@lingui/react/macro';
import { useCurrentMatchSequences } from './sequences/use-current-match-sequences';
import { SequencesDuration } from './sequences/sequences-duration';
import { SequencesDiskSpace } from './sequences/sequences-disk-space';
import { useCurrentMatch } from '../use-current-match';
function Separator() {
    return React.createElement("span", null, "|");
}
export function SequencesSummary() {
    const sequences = useCurrentMatchSequences();
    const match = useCurrentMatch();
    return (React.createElement("div", { className: "flex gap-x-4" },
        React.createElement("p", null,
            React.createElement(Plural, { value: sequences.length, one: "# sequence", other: "# sequences" })),
        React.createElement(Separator, null),
        React.createElement(SequencesDuration, { sequences: sequences, tickrate: match.tickrate }),
        React.createElement(Separator, null),
        React.createElement(SequencesDiskSpace, null)));
}
//# sourceMappingURL=sequences-summary.js.map