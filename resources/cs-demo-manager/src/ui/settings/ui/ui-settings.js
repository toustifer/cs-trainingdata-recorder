import React from 'react';
import { SettingsView } from 'csdm/ui/settings/settings-view';
import { ThemeSelect } from 'csdm/ui/settings/ui/theme-select';
import { LanguageSelect } from 'csdm/ui/settings/ui/language-select';
import { SystemStartupBehavior } from './system-startup-behavior';
import { ResetTablesState } from './reset-tables-state';
import { InitialPageSelect } from './initial-page-select';
import { RedirectDemoToMatch } from './redirect-demo-to-match';
import { EnableHardwareAcceleration } from './enable-hardware-acceleration';
export function UiSettings() {
    return (React.createElement(SettingsView, null,
        React.createElement(ThemeSelect, null),
        React.createElement(LanguageSelect, null),
        React.createElement(SystemStartupBehavior, null),
        React.createElement(InitialPageSelect, null),
        React.createElement(RedirectDemoToMatch, null),
        React.createElement(EnableHardwareAcceleration, null),
        React.createElement(ResetTablesState, null)));
}
//# sourceMappingURL=ui-settings.js.map