import React from 'react';
import { Trans } from '@lingui/react/macro';
import { useSettingsOverlay } from 'csdm/ui/settings/use-settings-overlay';
import { LeftBarTooltip } from './left-bar-tooltip';
import { CogsIcon } from 'csdm/ui/icons/cogs-icon';
import { modifierKey } from '../keyboard/keyboard-shortcut';
export function SettingsButton() {
    const { openSettings } = useSettingsOverlay();
    const onClick = () => {
        openSettings();
    };
    const shortcut = `${modifierKey}+,`;
    return (React.createElement(LeftBarTooltip, { content: React.createElement(Trans, null,
            "Settings (",
            shortcut,
            ")") },
        React.createElement("button", { className: "flex w-full cursor-pointer flex-col items-center border border-transparent py-4 text-gray-400 no-underline outline-hidden transition-all duration-85 hover:text-gray-900", onClick: onClick },
            React.createElement("div", { className: "flex w-32 justify-center" },
                React.createElement(CogsIcon, null)))));
}
//# sourceMappingURL=settings-button.js.map