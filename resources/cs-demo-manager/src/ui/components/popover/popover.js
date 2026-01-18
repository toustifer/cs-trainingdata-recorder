import React, { createContext, useContext, useState, } from 'react';
import { useFloating, autoUpdate, offset, flip, shift, useClick, useDismiss, useRole, useInteractions, useMergeRefs, FloatingPortal, FloatingFocusManager, useHover, safePolygon, } from '@floating-ui/react';
function usePopover({ initialOpen = false, openOnHover = false, openDelay = 0, closeDelay = 0, placement = 'top', modal, open: controlledOpen, onOpenChange: setControlledOpen, } = {}) {
    const [uncontrolledOpen, setUncontrolledOpen] = useState(initialOpen);
    const [labelId, setLabelId] = useState();
    const [descriptionId, setDescriptionId] = useState();
    const open = controlledOpen ?? uncontrolledOpen;
    const setOpen = setControlledOpen ?? setUncontrolledOpen;
    const data = useFloating({
        placement,
        open,
        onOpenChange: setOpen,
        whileElementsMounted: autoUpdate,
        middleware: [
            offset(4),
            flip({
                crossAxis: placement.includes('-'),
                fallbackAxisSideDirection: 'end',
                padding: 8,
            }),
            shift({ padding: 4 }),
        ],
    });
    const context = data.context;
    const click = useClick(context, {
        enabled: controlledOpen === null,
    });
    const dismiss = useDismiss(context);
    const role = useRole(context);
    const hover = useHover(context, {
        handleClose: safePolygon(),
        enabled: openOnHover,
        delay: { open: openDelay, close: closeDelay },
    });
    const interactions = useInteractions([click, dismiss, role, hover]);
    return {
        open,
        setOpen,
        ...interactions,
        ...data,
        modal,
        labelId,
        descriptionId,
        setLabelId,
        setDescriptionId,
    };
}
const PopoverContext = createContext(null);
function usePopoverContext() {
    const context = useContext(PopoverContext);
    if (context === null) {
        throw new Error('Popover components must be wrapped in <Popover />');
    }
    return context;
}
export function Popover({ children, modal = true, ...options }) {
    const popover = usePopover({ modal, ...options });
    return React.createElement(PopoverContext, { value: popover }, children);
}
export function PopoverTrigger({ children, ref: propRef, asChild = false, ...props }) {
    const context = usePopoverContext();
    const childrenRef = children.props.ref;
    const ref = useMergeRefs([context.refs.setReference, propRef, childrenRef]);
    if (asChild && React.isValidElement(children)) {
        return React.cloneElement(children, 
        // eslint-disable-next-line react-hooks/refs
        context.getReferenceProps({
            ref,
            ...props,
            ...children.props,
        }));
    }
    return (React.createElement("button", { ref: ref, type: "button", ...context.getReferenceProps(props) }, children));
}
export function PopoverContent({ ref: propRef, style, ...props } = {}) {
    const { context: floatingContext, ...context } = usePopoverContext();
    const ref = useMergeRefs([context.refs.setFloating, propRef]);
    if (!floatingContext.open) {
        return null;
    }
    return (React.createElement(FloatingPortal, null,
        React.createElement(FloatingFocusManager, { context: floatingContext, modal: context.modal },
            React.createElement("div", { ref: ref, style: { ...context.floatingStyles, ...style }, "aria-labelledby": context.labelId, "aria-describedby": context.descriptionId, ...context.getFloatingProps(props) }, props.children))));
}
//# sourceMappingURL=popover.js.map