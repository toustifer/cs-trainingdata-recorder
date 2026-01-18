import React, { useEffect, useState } from 'react';
import { Trans } from '@lingui/react/macro';
import { Status } from 'csdm/common/types/status';
import { Spinner } from 'csdm/ui/components/spinner';
import { Content, CenteredContent } from 'csdm/ui/components/content';
import { RendererClientMessageName } from 'csdm/server/renderer-client-message-name';
import { GrenadesFinder } from './grenades-finder';
import { useCurrentMatchChecksum } from 'csdm/ui/match/use-current-match-checksum';
import { UnsupportedMap } from 'csdm/ui/components/unsupported-map';
import { Message } from 'csdm/ui/components/message';
import { useCurrentMatchMap } from 'csdm/ui/match/use-current-match-map';
import { useWebSocketClient } from 'csdm/ui/hooks/use-web-socket-client';
import { useGetMapRadarSrc } from 'csdm/ui/maps/use-get-map-radar-src';
import { useCurrentMatch } from '../../use-current-match';
import { RadarLevel } from 'csdm/ui/maps/radar-level';
export function GrenadesFinderLoader() {
    const client = useWebSocketClient();
    const match = useCurrentMatch();
    const map = useCurrentMatchMap();
    const [state, setSate] = useState({
        status: Status.Loading,
        grenadesThrow: [],
    });
    const checksum = useCurrentMatchChecksum();
    const getMapRadarFileSrc = useGetMapRadarSrc();
    useEffect(() => {
        if (state.status !== Status.Loading) {
            return;
        }
        const fetchGrenades = async () => {
            try {
                const grenadesThrow = await client.send({
                    name: RendererClientMessageName.FetchMatchGrenadesThrow,
                    payload: checksum,
                });
                setSate({
                    status: Status.Success,
                    grenadesThrow,
                });
            }
            catch (error) {
                setSate({
                    ...state,
                    status: Status.Error,
                });
            }
        };
        fetchGrenades();
    }, [client, state, checksum]);
    const { status, grenadesThrow } = state;
    if (status === Status.Loading) {
        return (React.createElement(CenteredContent, null,
            React.createElement(Spinner, { size: 60 })));
    }
    if (status === Status.Error) {
        return React.createElement(Message, { message: React.createElement(Trans, null, "An error occurred.") });
    }
    const radarFileSrc = getMapRadarFileSrc(map?.name, match.game, RadarLevel.Upper);
    if (map === undefined || radarFileSrc === undefined) {
        return React.createElement(UnsupportedMap, null);
    }
    if (grenadesThrow.length === 0) {
        return React.createElement(Message, { message: React.createElement(Trans, null, "No grenades found.") });
    }
    return (React.createElement(Content, null,
        React.createElement(GrenadesFinder, { map: map, grenadesThrow: grenadesThrow })));
}
//# sourceMappingURL=grenades-finder-loader.js.map