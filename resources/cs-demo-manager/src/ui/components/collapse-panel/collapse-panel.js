import clsx from 'clsx';
import React, { useEffect, useRef, useState } from 'react';
export function CollapsePanel({ header, children, isEnabled = true }) {
    const [isContentVisible, setIsContentVisible] = useState(false);
    const [height, setHeight] = useState(0);
    const contentRef = useRef(null);
    useEffect(() => {
        if (isContentVisible && contentRef.current) {
            setHeight(contentRef.current.scrollHeight);
        }
        else {
            setHeight(0);
        }
    }, [isContentVisible, children]);
    return (React.createElement("div", null,
        React.createElement("div", { className: clsx('flex items-center rounded border border-gray-300 bg-gray-75 p-12', isEnabled && 'cursor-pointer'), onClick: () => {
                if (isEnabled) {
                    setIsContentVisible((prevIsVisible) => !prevIsVisible);
                }
            } }, header),
        React.createElement("div", { ref: contentRef, className: "overflow-hidden transition-[height] duration-200 ease-linear", style: {
                height: `${height}px`,
            } },
            React.createElement("div", { className: "flex flex-col overflow-auto border-x border-b border-gray-300 bg-gray-75 p-12" }, children))));
}
//# sourceMappingURL=collapse-panel.js.map