import ReactDOM from 'react-dom';
import React, { cloneElement, useState } from 'react';
import clsx from 'clsx';
import { offset, shift, autoUpdate, useFloating, useInteractions, useHover, useFocus, useRole, autoPlacement, useMergeRefs, useClientPoint, } from '@floating-ui/react';
function Wrapper({ x, y, refs, children, strategy, placement, getFloatingProps }) {
    const arrowClasses = {
        right: 'tooltip-right',
        left: 'tooltip-left',
        top: 'tooltip-top',
        bottom: 'tooltip-bottom',
    };
    const arrowClassName = arrowClasses[placement] ?? '';
    // Destructuring assignment to avoid false react compiler linting error.
    // https://github.com/facebook/react/issues/34775#issuecomment-3558154592
    const { setFloating } = refs;
    return (React.createElement("div", { ref: setFloating, className: clsx('z-10 rounded border border-gray-400 bg-gray-75 p-8 transition-opacity duration-300 select-none', arrowClassName), style: {
            position: strategy,
            top: y,
            left: x,
        }, ...getFloatingProps() }, children));
}
export function Tooltip({ children, content, delay = 500, // 500ms is the default on Windows/Linux. It's 2000ms on macOS but it's too long and annoying.
placement, renderInPortal, isEnabled = true, }) {
    const [isVisible, setIsVisible] = useState(false);
    const middleware = [offset(6), shift()];
    if (placement === undefined) {
        middleware.push(autoPlacement({
            allowedPlacements: ['bottom', 'left', 'right', 'top'],
            alignment: 'start',
        }));
    }
    const { x, y, strategy, context, refs, placement: finalPlacement, } = useFloating({
        placement,
        open: isVisible,
        onOpenChange: setIsVisible,
        middleware: middleware,
        whileElementsMounted: autoUpdate,
    });
    const { getReferenceProps, getFloatingProps } = useInteractions([
        useHover(context, {
            delay: {
                open: delay,
                close: 0,
            },
        }),
        useFocus(context),
        useRole(context, { role: 'tooltip' }),
    ]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ref = useMergeRefs([refs.setReference, children.ref]);
    if (!isEnabled) {
        return children;
    }
    const node = (React.createElement(Wrapper, { refs: refs, strategy: strategy, x: x, y: y, placement: finalPlacement, getFloatingProps: getFloatingProps }, content));
    return (React.createElement(React.Fragment, null,
        cloneElement(children, getReferenceProps({ ref, ...children.props })),
        isVisible ? (renderInPortal ? ReactDOM.createPortal(node, document.body) : node) : null));
}
export function useTooltip({ children, placement = 'top', isVisible }) {
    const { x, y, strategy, context, refs } = useFloating({
        placement,
        open: isVisible,
        middleware: [offset(16), shift()],
        whileElementsMounted: autoUpdate,
    });
    const { getReferenceProps, getFloatingProps } = useInteractions([useClientPoint(context)]);
    const node = (React.createElement(Wrapper, { refs: refs, strategy: strategy, x: x, y: y, placement: placement, getFloatingProps: getFloatingProps }, children));
    return { refs, getReferenceProps, node };
}
//# sourceMappingURL=tooltip.js.map