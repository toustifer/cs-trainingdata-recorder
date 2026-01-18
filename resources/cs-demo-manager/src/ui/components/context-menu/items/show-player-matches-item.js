import React from 'react';
import { useNavigate } from 'react-router';
import { Trans } from '@lingui/react/macro';
import { buildPlayerMatchesPath } from 'csdm/ui/routes-paths';
import { ContextMenuItem } from 'csdm/ui/components/context-menu/context-menu-item';
export function ShowPlayerMatchesItem({ steamIds }) {
    const navigate = useNavigate();
    const onClick = () => {
        const url = buildPlayerMatchesPath(steamIds[0]);
        navigate(url);
    };
    return (React.createElement(ContextMenuItem, { onClick: onClick, isDisabled: steamIds.length === 0 },
        React.createElement(Trans, { context: "Context menu" }, "Show matches")));
}
//# sourceMappingURL=show-player-matches-item.js.map