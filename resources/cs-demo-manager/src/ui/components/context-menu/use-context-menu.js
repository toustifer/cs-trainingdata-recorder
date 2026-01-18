import { useContext } from 'react';
import { ContextMenuContext } from './context-menu-provider';
export function useContextMenu() {
    const contextMenu = useContext(ContextMenuContext);
    return contextMenu;
}
//# sourceMappingURL=use-context-menu.js.map