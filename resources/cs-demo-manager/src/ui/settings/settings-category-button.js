import React, {} from 'react';
import clsx from 'clsx';
import { useSettingsOverlay } from './use-settings-overlay';
export function SettingsCategoryButton({ children, category }) {
    const { category: currentCategory, showCategory } = useSettingsOverlay();
    const onClick = () => {
        showCategory(category);
    };
    const isActive = currentCategory === category;
    return (React.createElement("button", { className: clsx('cursor-pointer py-8 text-left text-body-strong text-gray-900 no-underline transition-all duration-85 hover:opacity-100', isActive ? 'opacity-100' : 'opacity-50'), onClick: onClick },
        React.createElement("p", null, children)));
}
//# sourceMappingURL=settings-category-button.js.map