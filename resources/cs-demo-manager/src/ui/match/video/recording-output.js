import { Trans } from '@lingui/react/macro';
import { assertNever } from 'csdm/common/assert-never';
import { RecordingOutput as Output } from 'csdm/common/types/recording-output';
import React from 'react';
export function RecordingOutput({ output }) {
    switch (output) {
        case Output.Video:
            return React.createElement(Trans, null, "Video");
        case Output.Images:
            return React.createElement(Trans, null, "Images");
        case Output.ImagesAndVideo:
            return React.createElement(Trans, null, "Images + video");
        default:
            return assertNever(output, `Unknown recording output: ${output}`);
    }
}
//# sourceMappingURL=recording-output.js.map