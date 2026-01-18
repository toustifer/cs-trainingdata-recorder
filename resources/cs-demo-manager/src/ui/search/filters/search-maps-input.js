import React from 'react';
import { Trans, useLingui } from '@lingui/react/macro';
import { useWebSocketClient } from '../../hooks/use-web-socket-client';
import { RendererClientMessageName } from 'csdm/server/renderer-client-message-name';
import { useShowToast } from '../../components/toasts/use-show-toast';
import { SearchInput } from '../../components/inputs/search-input';
export function SearchMapsInput({ isDisabled, selectedMaps, onMapSelected, onMapRemoved }) {
    const client = useWebSocketClient();
    const showToast = useShowToast();
    const { t } = useLingui();
    return (React.createElement(SearchInput, { isDisabled: isDisabled, placeholder: t({
            context: 'Input placeholder',
            message: `Map's name`,
        }), noResultMessage: t `No maps found`, getValueId: (mapName) => mapName, onValueRemoved: onMapRemoved, onValueSelected: onMapSelected, renderResult: (mapName) => React.createElement("span", null, mapName), renderValue: (mapName) => React.createElement("span", null, mapName), selectedValues: selectedMaps, search: async (value, ignoredMapNames) => {
            try {
                const payload = {
                    name: value,
                    ignoredNames: ignoredMapNames,
                };
                const mapNames = await client.send({
                    name: RendererClientMessageName.SearchMaps,
                    payload,
                });
                return mapNames;
            }
            catch (error) {
                showToast({
                    type: 'error',
                    content: React.createElement(Trans, null, "An error occurred"),
                });
                return [];
            }
        } }));
}
//# sourceMappingURL=search-maps-input.js.map