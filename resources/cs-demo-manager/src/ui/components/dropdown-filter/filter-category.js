import React from 'react';
export function FilterCategory({ name, children, right }) {
    return (React.createElement("div", { className: "flex flex-col gap-y-8" },
        React.createElement("div", { className: "flex justify-between" },
            React.createElement("p", null, name),
            right),
        React.createElement("div", { className: "flex max-h-[150px] flex-wrap gap-x-8 gap-y-4 overflow-auto py-4" }, children)));
}
//# sourceMappingURL=filter-category.js.map