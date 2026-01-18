import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Plural, Trans } from '@lingui/react/macro';
import { useDispatch } from 'csdm/ui/store/use-dispatch';
import { PortInput } from 'csdm/ui/components/inputs/port-input';
import { DatabaseNameInput } from 'csdm/ui/components/inputs/database-name-input';
import { UsernameInput } from 'csdm/ui/components/inputs/username-input';
import { PasswordInput } from 'csdm/ui/components/inputs/password-input';
import { ConnectDatabaseButton } from 'csdm/ui/bootstrap/connect-database/connect-database-button';
import { HelpLink } from './help-link';
import { useWebSocketClient } from 'csdm/ui/hooks/use-web-socket-client';
import { useDatabaseSettings } from 'csdm/ui/settings/database/use-database-settings';
import { useUpdateSettings } from 'csdm/ui/settings/use-update-settings';
import { AppWrapper } from '../app-wrapper';
import { AppContent } from '../app-content';
import { connectDatabaseError, connectDatabaseSuccess } from '../bootstrap-actions';
import { HostnameInput } from 'csdm/ui/components/inputs/hostname-input';
import { RendererClientMessageName } from 'csdm/server/renderer-client-message-name';
import { useBootstrapState } from '../use-bootstrap-state';
import { ErrorCode } from 'csdm/common/error-code';
import { useArgument } from '../use-argument';
import { ArgumentName } from 'csdm/common/argument/argument-name';
import { CancelButton } from 'csdm/ui/components/buttons/cancel-button';
import { ErrorMessage } from 'csdm/ui/components/error-message';
import { ButtonVariant } from 'csdm/ui/components/buttons/button';
import { ResetDatabaseButton } from 'csdm/ui/settings/database/reset-database-button';
function DatabaseSchemaVersionMismatch() {
    return (React.createElement("div", null,
        React.createElement("p", null,
            React.createElement(Trans, null, "It looks like you installed an older version of CS Demo Manager and the current database schema is not compatible with it.")),
        React.createElement("p", null,
            React.createElement(Trans, null, "You can either update CS Demo Manager to the latest version or reset the database to start from scratch.")),
        React.createElement("div", { className: "mt-8" },
            React.createElement(ResetDatabaseButton, { variant: ButtonVariant.Danger }))));
}
function getHintFromError({ code, message }) {
    switch (code) {
        case ErrorCode.PsqlNotFound:
            return (React.createElement("p", null,
                React.createElement(Trans, null,
                    "It usually means that PostgreSQL is not installed on your system or the path to the ",
                    React.createElement("strong", null, "psql"),
                    ' ',
                    "executable is not in your ",
                    React.createElement("strong", null, "PATH"),
                    " environment variable.")));
        case ErrorCode.PsqlTimeout:
            return (React.createElement("p", null,
                React.createElement(Trans, null, "It usually means that the PostgreSQL service is not running, make sure it's running.")));
        case ErrorCode.DatabaseSchemaVersionMismatch:
            return React.createElement(DatabaseSchemaVersionMismatch, null);
    }
    if (message.includes('ECONNREFUSED')) {
        return (React.createElement("p", null,
            React.createElement(Trans, null, "This error usually means that the database is not running or that the connection settings are incorrect.")));
    }
    return (React.createElement("p", null,
        React.createElement(Trans, null, "Make sure PostgreSQL is running and your settings are correct.")));
}
export function ConnectDatabase() {
    const client = useWebSocketClient();
    const dispatch = useDispatch();
    const currentDatabaseSettings = useDatabaseSettings();
    const updateSettings = useUpdateSettings();
    const { error } = useBootstrapState();
    const [databaseSettings, setDatabaseSettings] = useState(currentDatabaseSettings);
    const [isConnecting, setIsConnecting] = useState(false);
    const [secondsBeforeNextTry, setSecondsBeforeNextTry] = useState(-1);
    const animationId = useRef(null);
    const appOpenedAtLoginArg = useArgument(ArgumentName.AppOpenedAtLogin);
    const stopRetrying = () => {
        if (animationId.current !== null) {
            window.cancelAnimationFrame(animationId.current);
        }
        setSecondsBeforeNextTry(-1);
    };
    const connectDatabase = useCallback(async () => {
        stopRetrying();
        setIsConnecting(true);
        const error = await client.send({
            name: RendererClientMessageName.ConnectDatabase,
            payload: databaseSettings,
        });
        if (error) {
            setIsConnecting(false);
            dispatch(connectDatabaseError({ error }));
        }
        else {
            await updateSettings({
                database: databaseSettings,
            });
            dispatch(connectDatabaseSuccess());
        }
        return error;
    }, [client, databaseSettings, dispatch, updateSettings]);
    useEffect(() => {
        const onKeyDown = (event) => {
            if (event.key === 'Enter') {
                event.stopPropagation();
                connectDatabase();
            }
        };
        window.addEventListener('keydown', onKeyDown);
        return () => {
            window.removeEventListener('keydown', onKeyDown);
        };
    });
    useEffect(() => {
        if (appOpenedAtLoginArg !== 'true') {
            return;
        }
        const delayInMs = 10_000;
        let start = null;
        const loop = async (time) => {
            if (start === null) {
                start = time;
            }
            const elapsed = time - start;
            if (elapsed >= delayInMs) {
                start = null;
                const error = await connectDatabase();
                if (error) {
                    animationId.current = window.requestAnimationFrame(loop);
                }
            }
            else {
                const seconds = Math.round((delayInMs - elapsed) / 1000);
                setSecondsBeforeNextTry(seconds);
                animationId.current = window.requestAnimationFrame(loop);
            }
        };
        animationId.current = window.requestAnimationFrame(loop);
        return () => {
            stopRetrying();
        };
    }, [appOpenedAtLoginArg, connectDatabase]);
    const renderError = () => {
        if (!error) {
            return null;
        }
        const hint = getHintFromError(error);
        return (React.createElement("div", { className: "m-auto mt-8 flex max-w-[600px] flex-col" },
            React.createElement(ErrorMessage, { message: React.createElement(Trans, null, "The connection to the database failed with the following error:") }),
            React.createElement("p", { className: "my-8 text-body-strong select-text" }, error.message),
            hint));
    };
    return (React.createElement(AppWrapper, null,
        React.createElement(AppContent, null,
            React.createElement("div", { className: "m-auto flex flex-col" },
                React.createElement("div", { className: "m-auto flex w-[400px] flex-col" },
                    React.createElement("div", null,
                        React.createElement("p", null,
                            React.createElement(Trans, null, "CS Demo Manager requires a PostgreSQL database.")),
                        React.createElement(HelpLink, null)),
                    React.createElement("div", { className: "mt-12 flex flex-col gap-12" },
                        React.createElement("div", { className: "flex gap-x-8" },
                            React.createElement("div", { className: "w-full" },
                                React.createElement(HostnameInput, { hostname: databaseSettings.hostname, onChange: (event) => {
                                        setDatabaseSettings({
                                            ...databaseSettings,
                                            hostname: event.target.value,
                                        });
                                    }, isDisabled: isConnecting })),
                            React.createElement(PortInput, { port: databaseSettings.port, onChange: (event) => {
                                    setDatabaseSettings({
                                        ...databaseSettings,
                                        port: +event.target.value,
                                    });
                                }, isDisabled: isConnecting })),
                        React.createElement(DatabaseNameInput, { databaseName: databaseSettings.database, onChange: (event) => {
                                setDatabaseSettings({
                                    ...databaseSettings,
                                    database: event.target.value,
                                });
                            }, isDisabled: isConnecting }),
                        React.createElement(UsernameInput, { username: databaseSettings.username, onChange: (event) => {
                                setDatabaseSettings({
                                    ...databaseSettings,
                                    username: event.target.value,
                                });
                            }, isDisabled: isConnecting }),
                        React.createElement(PasswordInput, { password: databaseSettings.password, onChange: (event) => {
                                setDatabaseSettings({
                                    ...databaseSettings,
                                    password: event.target.value,
                                });
                            }, isDisabled: isConnecting }),
                        React.createElement("div", { className: "flex items-center justify-between" },
                            React.createElement(ConnectDatabaseButton, { isLoading: isConnecting, onClick: connectDatabase }),
                            secondsBeforeNextTry > 0 && (React.createElement("div", { className: "flex items-center gap-x-8" },
                                React.createElement("p", null,
                                    React.createElement(Plural, { value: secondsBeforeNextTry, one: "Retrying in # second\u2026", other: "Retrying in # seconds\u2026" })),
                                React.createElement(CancelButton, { onClick: stopRetrying })))))),
                renderError()))));
}
//# sourceMappingURL=connect-database.js.map