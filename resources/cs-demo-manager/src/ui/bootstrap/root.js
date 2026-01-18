import React, { StrictMode } from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { MotionConfig } from 'motion/react';
import { store } from 'csdm/ui/store/store';
import { AppLoader } from 'csdm/ui/bootstrap/app-loader';
import { LocaleProvider } from 'csdm/ui/bootstrap/locale-provider';
import { TitleBar } from 'csdm/ui/title-bar/title-bar';
import { ArgumentsProvider } from 'csdm/ui/bootstrap/arguments-provider';
import { SettingsProvider } from 'csdm/ui/bootstrap/settings-provider';
import { WebSocketProvider } from 'csdm/ui/bootstrap/web-socket-provider';
import { DatabaseLoader } from 'csdm/ui/bootstrap/database-loader';
import { DialogProvider } from 'csdm/ui/components/dialogs/dialog-provider';
import { ToastsProvider } from 'csdm/ui/components/toasts/toasts-provider';
import { SettingsOverlayProvider } from 'csdm/ui/settings/settings-overlay-provider';
import { APP_ELEMENT_ID } from 'csdm/ui/shared/element-ids';
function App() {
    return (React.createElement(ReduxProvider, { store: store },
        React.createElement(MotionConfig, { reducedMotion: "user" },
            React.createElement(LocaleProvider, null,
                React.createElement(TitleBar, null),
                React.createElement(ArgumentsProvider, null,
                    React.createElement(ToastsProvider, null,
                        React.createElement(SettingsProvider, null,
                            React.createElement(WebSocketProvider, null,
                                React.createElement(DialogProvider, { inertElementId: APP_ELEMENT_ID },
                                    React.createElement(DatabaseLoader, null,
                                        React.createElement(SettingsOverlayProvider, null,
                                            React.createElement(AppLoader, null))))))))))));
}
export function Root() {
    if (REACT_STRICT_MODE_ENABLED) {
        return (React.createElement(StrictMode, null,
            React.createElement(App, null)));
    }
    return React.createElement(App, null);
}
//# sourceMappingURL=root.js.map