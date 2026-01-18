import React from 'react';
import { useLingui } from '@lingui/react/macro';
import { TextArea } from 'csdm/ui/components/inputs/text-area';
export function CfgInput({ cfg, onBlur }) {
    const { t } = useLingui();
    return (React.createElement(TextArea, { id: "cfg", defaultValue: cfg, placeholder: t({
            id: 'video-cfg-placeholder',
            context: 'Input placeholder',
            message: `CFG executed at the beginning of the sequence.\n\nExample:\ncl_draw_only_deathnotices 0`,
        }), resizable: false, spellCheck: false, onBlur: onBlur }));
}
//# sourceMappingURL=cfg-input.js.map