import React from 'react';
import { Trans } from '@lingui/react/macro';
import { useHlaeSettings } from 'csdm/ui/settings/video/hlae/use-hlae-settings';
import { TextInput } from 'csdm/ui/components/inputs/text-input';
export function HlaeParameters() {
    const { hlaeSettings, updateHlaeSettings } = useHlaeSettings();
    const onChange = (event) => {
        updateHlaeSettings({
            parameters: event.target.value,
        });
    };
    return (React.createElement(TextInput, { label: React.createElement(Trans, { context: "Input label" }, "Parameters"), onChange: onChange, value: hlaeSettings.parameters ?? '' }));
}
//# sourceMappingURL=hlae-parameters.js.map