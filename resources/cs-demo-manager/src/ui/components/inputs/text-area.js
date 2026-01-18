import React from 'react';
import clsx from 'clsx';
export function TextArea({ resizable = true, ref, ...props }) {
    return (React.createElement("textarea", { ref: ref, className: clsx('size-full appearance-none rounded border border-gray-400 bg-gray-50 p-8 text-gray-800 outline-hidden transition-all duration-85 placeholder:text-gray-500 focus:border-gray-900 hover:enabled:border-gray-600 hover:enabled:focus:border-gray-900 disabled:cursor-default disabled:bg-gray-200 disabled:text-gray-500', resizable ? 'resize-y' : 'resize-none'), style: {
            fieldSizing: 'content',
        }, ...props }));
}
//# sourceMappingURL=text-area.js.map