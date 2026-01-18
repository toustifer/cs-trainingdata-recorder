import React, { useEffect } from 'react';
import { i18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';
import { useLocale } from 'csdm/ui/settings/ui/use-locale';
import { getLocaleFolderName } from 'csdm/common/get-locale-folder-name';
export function LocaleProvider({ children }) {
    const locale = useLocale();
    useEffect(() => {
        const loadLocaleMessages = async () => {
            try {
                const folderName = getLocaleFolderName(locale);
                const po = await import(`../translations/${folderName}/messages.po`);
                i18n.loadAndActivate({ locale, messages: po.messages });
            }
            catch (error) {
                const en = await import('../translations/en/messages.po');
                i18n.loadAndActivate({ locale: 'en', messages: en.messages });
            }
        };
        loadLocaleMessages();
    }, [locale]);
    return React.createElement(I18nProvider, { i18n: i18n }, children);
}
//# sourceMappingURL=locale-provider.js.map