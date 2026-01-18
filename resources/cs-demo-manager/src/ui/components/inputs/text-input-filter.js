import React, { useEffect, useRef } from 'react';
import { useLingui } from '@lingui/react/macro';
import { select } from '@lingui/core/macro';
import { TextInput } from 'csdm/ui/components/inputs/text-input';
import { isCtrlOrCmdEvent } from 'csdm/ui/keyboard/keyboard';
export function TextInputFilter({ value, onChange, isDisabled }) {
    const ref = useRef(null);
    const { t } = useLingui();
    useEffect(() => {
        const onKeyDown = (event) => {
            const { key } = event;
            if (key === 'Escape') {
                ref.current?.blur();
            }
            else if (key === 'f' && isCtrlOrCmdEvent(event)) {
                ref.current?.focus();
            }
        };
        window.addEventListener('keydown', onKeyDown);
        return () => {
            window.removeEventListener('keydown', onKeyDown);
        };
    }, []);
    const handleChange = (event) => {
        onChange(event.target.value);
    };
    return (React.createElement("div", null,
        React.createElement(TextInput, { ref: ref, type: "search", placeholder: t({
                context: 'Input placeholder',
                message: select(window.csdm.platform, {
                    darwin: 'Filter… (⌘+F)',
                    other: 'Filter… (CTRL+F)',
                }),
            }), onChange: handleChange, value: value, isDisabled: isDisabled })));
}
//# sourceMappingURL=text-input-filter.js.map