import React, { useEffect, useRef } from 'react';
import { Outlet } from 'react-router';
import { Trans } from '@lingui/react/macro';
import { Status } from 'csdm/common/types/status';
import { Message } from 'csdm/ui/components/message';
import { useTeamState } from './use-team-state';
import { useFetchTeam } from './use-fetch-team';
import { LoadTeamError } from './load-team-error';
export function TeamLoader() {
    const { errorCode, status } = useTeamState();
    const fetchTeam = useFetchTeam();
    const shouldFetch = useRef(true);
    useEffect(() => {
        if (status === Status.Idle || shouldFetch.current) {
            fetchTeam();
            shouldFetch.current = false;
        }
    });
    if (status === Status.Idle || status === Status.Loading) {
        return React.createElement(Message, { message: React.createElement(Trans, null, "Loading team\u2026") });
    }
    if (status === Status.Error) {
        return React.createElement(LoadTeamError, { errorCode: errorCode });
    }
    return React.createElement(Outlet, null);
}
//# sourceMappingURL=team-loader.js.map