import React, { useState } from 'react';
import { Trans } from '@lingui/react/macro';
import { InputNumber } from 'csdm/ui/components/inputs/number-input';
import { useIsHlaeEnabled } from './hlae/use-is-hlae-enabled';
export function DeathNoticesDurationInput({ value, onBlur }) {
    const [duration, setDuration] = useState(String(value));
    const isHlaeEnabled = useIsHlaeEnabled();
    if (!isHlaeEnabled) {
        return null;
    }
    const handleOnBlur = () => {
        onBlur?.(parseInt(duration, 10));
    };
    const onChange = (event) => {
        setDuration(event.target.value);
    };
    return (React.createElement(InputNumber, { name: "death-notices-duration", label: React.createElement(Trans, null, "Death notices duration (seconds)"), min: 0, onChange: onChange, value: duration, onBlur: handleOnBlur }));
}
//# sourceMappingURL=death-notices-duration-input.js.map