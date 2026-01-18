import React from 'react';
import { Plural } from '@lingui/react/macro';
import { getSequencesDuration } from './get-sequences-duration';
export function SequencesDuration({ sequences, tickrate }) {
    const duration = getSequencesDuration(sequences, tickrate);
    return (React.createElement("span", null,
        React.createElement(Plural, { value: duration, zero: '0 seconds', one: '1 second', other: '# seconds' })));
}
//# sourceMappingURL=sequences-duration.js.map