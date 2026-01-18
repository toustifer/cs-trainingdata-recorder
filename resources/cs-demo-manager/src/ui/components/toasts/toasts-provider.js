import React, { useState, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ToastsContext } from './toasts-context';
import { ExclamationTriangleIcon } from 'csdm/ui/icons/exclamation-triangle-icon';
import { CheckCircleIcon } from 'csdm/ui/icons/check-circle-icon';
import { TimesCircleIcon } from 'csdm/ui/icons/times-circle';
export function ToastsProvider({ children }) {
    const [toasts, setToasts] = useState([]);
    const timeouts = useRef(new Map());
    const showToast = (options) => {
        const toastId = options.id ?? window.crypto.randomUUID();
        const timeoutId = timeouts.current.get(toastId)?.id;
        window.clearTimeout(timeoutId);
        const durationInMs = 5000;
        timeouts.current.set(toastId, {
            id: window.setTimeout(() => {
                removeToast(toastId);
            }, durationInMs),
            // https://github.com/facebook/react/issues/34834
            // eslint-disable-next-line react-hooks/purity
            startedAt: Date.now(),
            msRemaining: durationInMs,
        });
        const isToastAlreadyExists = timeoutId !== undefined || toasts.some((toast) => toast.id === toastId);
        if (isToastAlreadyExists) {
            setToasts((toasts) => {
                return toasts.map((toast) => {
                    if (toast.id === toastId) {
                        return { ...options, id: toastId };
                    }
                    return toast;
                });
            });
        }
        else {
            setToasts((toasts) => {
                return [
                    ...toasts,
                    {
                        ...options,
                        id: toastId,
                    },
                ];
            });
        }
    };
    const removeToast = (toastId) => {
        window.clearTimeout(timeouts.current.get(toastId)?.id);
        timeouts.current.delete(toastId);
        setToasts((toasts) => {
            return toasts.filter((toast) => toast.id !== toastId);
        });
    };
    return (React.createElement(ToastsContext.Provider, { value: showToast },
        children,
        React.createElement("div", { className: "absolute top-48 right-24 z-10 flex max-w-[448px] flex-col gap-y-8" },
            React.createElement(AnimatePresence, null, toasts.map((toast) => {
                const renderContent = () => {
                    let icon = null;
                    switch (toast.type) {
                        case 'success':
                            icon = React.createElement(CheckCircleIcon, { className: "mr-8 size-24 self-center text-green-500" });
                            break;
                        case 'error':
                            icon = React.createElement(TimesCircleIcon, { className: "mr-8 size-24 self-center text-red-500" });
                            break;
                        case 'warning':
                            icon = React.createElement(ExclamationTriangleIcon, { className: "mr-8 size-24 self-center text-orange-500" });
                            break;
                    }
                    return (React.createElement("div", { className: "flex items-center" },
                        icon,
                        React.createElement("div", { className: "flex-1 select-none" }, toast.content)));
                };
                return (React.createElement(motion.div, { key: toast.id, className: "ml-auto flex min-w-[300px] rounded-8 border-2 border-gray-300 bg-gray-75 p-16 text-gray-900", initial: { opacity: 0, x: 100 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: 100 }, transition: { duration: 0.3 }, role: "alert", onMouseEnter: () => {
                        const timeout = timeouts.current.get(toast.id);
                        if (!timeout) {
                            return;
                        }
                        timeout.msRemaining -= Date.now() - timeout.startedAt;
                        window.clearTimeout(timeout.id);
                    }, onMouseLeave: () => {
                        const timeout = timeouts.current.get(toast.id);
                        if (!timeout) {
                            return;
                        }
                        timeouts.current.set(toast.id, {
                            id: window.setTimeout(() => {
                                removeToast(toast.id);
                            }, timeout.msRemaining),
                            startedAt: Date.now(),
                            msRemaining: timeout.msRemaining,
                        });
                    }, onClick: () => {
                        toast.onClick?.();
                        removeToast(toast.id);
                    } }, renderContent()));
            })))));
}
//# sourceMappingURL=toasts-provider.js.map