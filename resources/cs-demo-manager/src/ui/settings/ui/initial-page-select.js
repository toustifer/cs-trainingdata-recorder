import React from 'react';
import { Trans, useLingui } from '@lingui/react/macro';
import { Select } from 'csdm/ui/components/inputs/select';
import { SettingsEntry } from 'csdm/ui/settings/settings-entry';
import { useUpdateSettings } from '../use-update-settings';
import { Page } from 'csdm/node/settings/page';
import { useUiSettings } from './use-ui-settings';
export function InitialPageSelect() {
    const { t } = useLingui();
    const { initialPage } = useUiSettings();
    const updateSettings = useUpdateSettings();
    const labelPerPage = {
        [Page.Matches]: t({
            context: 'Select option initial page',
            message: 'Matches',
        }),
        [Page.Demos]: t({
            context: 'Select option initial page',
            message: 'Demos',
        }),
        [Page.Players]: t({
            context: 'Select option initial page',
            message: 'Players',
        }),
        [Page.Download]: t({
            context: 'Select option initial page',
            message: 'Download',
        }),
        [Page.Teams]: t({
            context: 'Select option initial page',
            message: 'Teams',
        }),
    };
    const options = Object.values(Page).map((page) => {
        return {
            value: page,
            label: labelPerPage[page],
        };
    });
    return (React.createElement(SettingsEntry, { interactiveComponent: React.createElement(Select, { options: options, value: initialPage, onChange: async (page) => {
                await updateSettings({
                    ui: {
                        initialPage: page,
                    },
                });
            } }), description: React.createElement(Trans, null, "Initial page displayed on app startup"), title: React.createElement(Trans, { context: "Settings title" }, "Initial page") }));
}
//# sourceMappingURL=initial-page-select.js.map