import React, { useEffect, useState } from 'react';
import { Trans } from '@lingui/react/macro';
import { settingsUpdated } from 'csdm/ui/settings/settings-actions';
import { Status } from 'csdm/common/types/status';
import { useDispatch } from 'csdm/ui/store/use-dispatch';
import { Loading } from './loading';
import { LoadingError } from './loading-error';
export function SettingsProvider({ children }) {
    const dispatch = useDispatch();
    const [status, setStatus] = useState(Status.Loading);
    const [error, setError] = useState('');
    useEffect(() => {
        const loadSettings = async () => {
            try {
                const settings = await window.csdm.parseSettingsFile();
                dispatch(settingsUpdated({ settings }));
                setStatus(Status.Success);
            }
            catch (error) {
                if (error instanceof Error) {
                    setError(error.message);
                }
                else {
                    setError(JSON.stringify(error));
                }
                setStatus(Status.Error);
            }
        };
        loadSettings();
    }, [dispatch]);
    if (status === Status.Loading) {
        return React.createElement(Loading, null);
    }
    if (status === Status.Error) {
        return React.createElement(LoadingError, { title: React.createElement(Trans, null, "An error occurred while loading settings."), error: error });
    }
    return children;
}
//# sourceMappingURL=settings-provider.js.map