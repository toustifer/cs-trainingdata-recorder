import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import clsx from 'clsx';
import { LeftArrowIcon } from 'csdm/ui/icons/left-arrow-icon';
import { RightArrowIcon } from '../icons/right-arrow-icon';
import { Tooltip } from './tooltip';
// ⌘ on macOS, CTRL on Windows/Linux
function isNavigationEvent(event) {
    if (event.shiftKey || event.altKey || event.repeat) {
        return false;
    }
    const { target } = event;
    if (target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        (target instanceof HTMLDivElement && target.hasAttribute('contenteditable'))) {
        return false;
    }
    if (window.csdm.isMac) {
        return event.metaKey && !event.ctrlKey;
    }
    return event.ctrlKey && !event.metaKey;
}
function NavigationLink({ children, ref, to, isDisabled }) {
    const { state } = useLocation();
    return (React.createElement(Link, { ref: ref, className: clsx('flex h-full items-center', isDisabled ? 'pointer-events-none cursor-default text-gray-600' : 'cursor-pointer text-gray-900'), to: to, state: state, "aria-disabled": isDisabled, viewTransition: true }, children));
}
function useKeyboardNavigation(to, direction) {
    const navigate = useNavigate();
    const location = useLocation();
    useEffect(() => {
        if (to === '') {
            return;
        }
        const directionKey = direction === 'left' ? 'ArrowLeft' : 'ArrowRight';
        const onKeyDown = (event) => {
            if (isNavigationEvent(event) && event.key === directionKey) {
                navigate(to, {
                    state: location.state,
                });
            }
        };
        window.addEventListener('keydown', onKeyDown);
        return () => {
            window.removeEventListener('keydown', onKeyDown);
        };
    }, [navigate, to, direction, location.state]);
}
export function PreviousLink({ tooltip, to }) {
    useKeyboardNavigation(to, 'left');
    const isDisabled = to === '';
    const link = (React.createElement(NavigationLink, { to: to, isDisabled: isDisabled },
        React.createElement(LeftArrowIcon, { height: 20 })));
    if (isDisabled) {
        return link;
    }
    return React.createElement(Tooltip, { content: tooltip }, link);
}
export function NextLink({ tooltip, to }) {
    useKeyboardNavigation(to, 'right');
    const isDisabled = to === '';
    const link = (React.createElement(NavigationLink, { to: to, isDisabled: isDisabled },
        React.createElement(RightArrowIcon, { height: 20 })));
    if (isDisabled) {
        return link;
    }
    return React.createElement(Tooltip, { content: tooltip }, link);
}
//# sourceMappingURL=links.js.map